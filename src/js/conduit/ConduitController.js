'use strict';

import ConduitCollection from './ConduitCollection';
import Conduit from './Conduit';

import Logger from '../utils/logger';

export default class ConduitController {
  /**
   * Use this method to instantiate a new ConduitController.
   *
   * @param {Object} config
   */
  static factory (config = {}) {
    return new ConduitController(config);
  }

  /**
   * @private
   *
   * Do NOT use this method to instantiate a new ConduitController.
   *
   * @todo - document the params
   * @param {config} param0
   */
  constructor ({
    logId,
    clientId,
    CONNECT_TIMEOUT = 10,
    DISCONNECT_TIMEOUT = 10,
  }) {
    if (!logId) {
      throw new Error('logId is required');
    }

    if (!clientId) {
      throw new Error('clientId is required');
    }

    // state
    this.logId = logId;
    this.clientId = clientId;
    this.CONNECT_TIMEOUT = CONNECT_TIMEOUT;
    this.DISCONNECT_TIMEOUT = DISCONNECT_TIMEOUT;

    this.logger = Logger().factory(`Conduit Controller ${this.logId}`);
    this.logger.debug('Constructing');

    // initialization
    this._clearAllTimeouts();
    this._destroyConduit();
    this.initialize();
  }

  /**
   * Must be called before performing any other operation.  This method destroys
   * the existing conduit and creates a new one.  By using a new Conduit
   * instance after every failure and disconnection, the risks of race
   * conditions, side-effects, and unexpected behaviors from event-based
   * operation are minimized.
   *
   * @returns {this}
   */
  initialize () {
    this.logger.debug('Initializing');

    // Remove the existing conduit
    this._destroyConduit();

    // Create the new conduit
    this.conduit = ConduitCollection.asSingleton().create(
      this.logId,
      this.clientId,
      // @todo - the rest of the arguments
    );

    this.isInitialized = true;

    return this;
  }

  /**
   * Connect to the CLSP server.  Must be called before `play`.
   *
   * @returns {Promise}
   *   Resolves when the connection is successful
   *   Rejects never - connection attempts are recursively attempted indefinitely
   */
  connect () {
    this.logger.debug('Attempting to connect');

    return new Promise((resolve, reject) => {
      if (!this.isInitialized) {
        return reject(new Error('Cannot connect before initialization'));
      }

      const finish = (error) => {
        this._clearConnectTimeout();

        if (!error) {
          this.logger.debug('Successfully connected');
          this.isConnected = true;

          return resolve();
        }

        this.logger.error('Error while connecting');
        this.logger.error(error);

        // Attempt to disconnect, but don't wait for it.  Hopefully this will
        // gracefully cancel any in-progress connection attempts.
        // this.disconnect();

        // Since the connection failed, don't do anything fancy to try to
        // recover, since there may be other pending operations that may cause
        // race conditions.  Instead, terminate the connection as best as we
        // can by destroying the Conduit and try again.
        this.initialize();

        // Recursively try to connect.  Reject should never be called, because
        // we never stop trying to reconnect.
        this.connect()
          .then(resolve)
          .catch(reject);
      }

      this._connectTimeout = setTimeout(() => {
        finish(`Connection timed out after ${this.CONNECT_TIMEOUT} seconds`);
      }, this.CONNECT_TIMEOUT * 1000);

      this.conduit.connect()
        .then(finish)
        .catch(finish);
    });
  }

  /**
   * Disconnect from the CLSP server.
   *
   * Whether the disconnection succeeds or fails, a new conduit instance is
   * always created, so the caller can immediately call `connect` after awaiting
   * this method.
   *
   * @returns {Promise}
   *   Resolves upon successful disconnection
   *   Rejects when disconnection fails or times out
   */
  disconnect () {
    this.logger.debug('Attempting to disconnect');

    return new Promise((resolve, reject) => {
      if (!this.isInitialized) {
        return reject(new Error('Cannot disconnect before initialization'));
      }

      // @todo - is this check necessary?
      // if (!this.isConnected) {
      //   return reject(new Error('Cannot disconnect before connecting'));
      // }

      const finish = (error) => {
        this._clearDisconnectTimeout();

        if (!error) {
          this.logger.debug('Successfully disconnected');
          this.isConnected = false;
          this.isPlaying = false;

          // After disconnecting, even if there wasn't an error we initialize
          // here so that the caller has a conduit ready to connect and play.
          // This may be less efficient than it could be, but it prevents
          // unintended side-effects and race conditions that occur when reusing
          // conduits.
          this.initialize();

          // When we disconnect properly, there is no need to destroy the
          // existing conduit.
          return resolve();
        }

        // Since the disconnection failed, don't do anything fancy to try to
        // recover, since there may be other pending operations that may cause
        // race conditions.  Since we attempted to disconnect, we have no further
        // use for this particular conduit.  Destroy it and be done with it.
        // We will create a new one here so that subsequent operations have a
        // Conduit instance to work with.
        this.initialize();

        this.logger.error('Error while disconnecting');
        reject(error);
      }

      // After trying to stop, try to disconnect
      const onStop = async (error) => {
        if (error) {
          this.logger.error('Error trying to stop while trying to disconnect');
          this.logger.error(error);
        }

        try {
          await this.conduit.disconnect();
          finish();
        }
        catch (error) {
          finish(error);
        }
      }

      this._disconnectTimeout = setTimeout(() => {
        finish(`Disconnection timed out after ${this.DISCONNECT_TIMEOUT} seconds`);
      }, (this.STOP_TIMEOUT + this.DISCONNECT_TIMEOUT) * 1000);

      // Try to stop before trying to disconnect
      this.stop()
        .then(onStop)
        .catch(onStop);
    });
  }

  /**
   * Play the CLSP stream that this Conduit Controller was instantiated with.
   *
   * If play fails, a new conduit instance is created, so the caller can
   * immediately call `connect` after awaiting this method.
   *
   * On success, the stream is playing, and the caller may call `stop` or
   * `disconnect` if desired.
   *
   * @returns {Promise}
   *   Resolves if play starts
   *   Rejects if play fails to start or times out
   */
  play () {
    this.logger.debug('Attempting to play');

    return new Promise((resolve, reject) => {
      if (!this.isInitialized) {
        return reject(new Error('Cannot play before initialization'));
      }

      if (!this.isConnected) {
        return reject(new Error('Cannot play before connecting'));
      }

      if (this.isPlaying) {
        this.logger.warn('Conduit is already playing');
        return resolve();
      }

      const finish = (error) => {
        this._clearPlayTimeout();

        if (!error) {
          this.logger.debug('Successfully started playing');
          this.isPlaying = true;
          return resolve();
        }

        this.logger.error('Error while starting play');

        // If we cannot even start to play the stream, disconnect and reject so
        // the caller can try again
        this.disconnect()
          .then(() => {
            // Play failed, and disconnection went smoothly
            reject(error);
          })
          .catch((disconnectError) => {
            // When disconnection fails, we know the conduit has already been
            // reinitialized
            this.logger.error('Error while disconnecting after error while starting to play');
            this.logger.error(disconnectError);
            reject(error);
          });
      };

      this._playTimeout = setTimeout(() => {
        finish(`Play timed out after ${this.PLAY_TIMEOUT} seconds`);
      }, this.PLAY_TIMEOUT * 1000);

      this.conduit.play()
        .then(finish)
        .catch(finish);
    });
  }

  /**
   * @alias disconnect
   */
  stop () {
    this.logger.debug('Attempting to stop');

    // To avoid side-effects and race conditions that can occur when reusing
    // conduits, disconnect to stop.
    return this.disconnect();
  }

  /**
   * @private
   *
   * This method is a wrapper for the conduit `stop` method.  Do not call it
   * directly.  It is only ever called internally by the `disconnect` method.
   *
   * Note that this method does not call `initialize` as that is done by the
   * `disconnect` command.
   *
   * @returns {Promise}
   *   Resolves if the conduit stop command succeeded
   *   Rejects if the conduit stop command failed or timed out
   */
  _stop () {
    this.logger.debug('Attempting to perform conduit stop');

    return new Promise((resolve, reject) => {
      if (!this.isInitialized) {
        return reject(new Error('Cannot stop before initialization'));
      }

      if (!this.isConnected) {
        return reject(new Error('Cannot stop before connecting'));
      }

      if (!this.isPlaying) {
        this.logger.warn('Conduit is already stopped');
        return resolve();
      }

      const finish = (error) => {
        this._clearStopTimeout();

        if (!error) {
          this.logger.debug('Successfully perfomed conduit stop');
          this.isPlaying = false;

          return resolve();
        }

        // Since this method is only meant to be called by disconnect, let the
        // calling disconnect method handle the rest of the clean up and
        // initialization
        this.logger.error('Error while performing conduit stop');
        reject(error);
      };

      this._stopTimeout = setTimeout(() => {
        finish(`Stop timed out after ${this.STOP_TIMEOUT} seconds`);
      }, this.STOP_TIMEOUT * 1000);

      this.conduit.stop()
        .then(finish)
        .catch(finish);
    });
  }

  /**
   * @private
   *
   * After failures, timeouts, and disconnects, this method must be called
   * before instantiating a new conduit.  This method should only be called
   * by `initialize` and `destroy`.
   *
   * @returns {void}
   */
  _destroyConduit () {
    this.logger.debug('Destroying conduit');

    // Attempt a graceful destroy
    if (this.isPlaying) {
      this.stop();
    }
    else if (this.isConnected) {
      this.disconnect();
    }

    if (this.conduit) {
      ConduitCollection.asSingleton().remove(this.clientId);
    }

    this.conduit = null;
    this.isInitialized = false;
    this.isConnected = false;
    this.isPlaying = false;
  }

  /**
   * @private
   */
  _clearConnectTimeout () {
    this.logger.debug('Clearing connect timeout');

    if (this._connectTimeout) {
      clearTimeout(this._connectTimeout);
    }

    this._connectTimeout = null;
  }

  /**
   * @private
   */
  _clearDisconnectTimeout () {
    this.logger.debug('Clearing disconnect timeout');

    if (this._disconnectTimeout) {
      clearTimeout(this._disconnectTimeout);
    }

    this._disconnectTimeout = null;
  }

  /**
   * @private
   */
  _clearPlayTimeout () {
    this.logger.debug('Clearing play timeout');

    if (this._playTimeout) {
      clearTimeout(this._playTimeout);
    }

    this._playTimeout = null;
  }

  /**
   * @private
   */
  _clearStopTimeout () {
    this.logger.debug('Clearing stop timeout');

    if (this._stopTimeout) {
      clearTimeout(this._stopTimeout);
    }

    this._stopTimeout = null;
  }

  /**
   * @private
   */
  _clearAllTimeouts () {
    this._clearConnectTimeout();
    this._clearDisconnectTimeout();
    this._clearPlayTimeout();
    this._clearStopTimeout();
  }

  /**
   * Destroy this Conduit Controller and its associated Conduit instance.
   *
   * @returns {void}
   */
  destroy () {
    this.logger.debug('Destroying');

    if (this.destroyed) {
      return;
    }

    this._clearAllTimeouts();
    this._destroyConduit();
  }
}
