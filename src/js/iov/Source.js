'use strict';

/**
 * A Source instance represents the url (and some other properties) of a stream
 * that exists on an SFS.
 */
export default class Source {
  // This is the default port over which CLSP streams are served
  static DEFAULT_PORT = 9001;
  // This is the default secure port over which CLSP streams are served
  static SSL_PORT = 443;
  // This is every property that can exist on a Source instance
  static PROPERTIES = [
    'useSSL',
    'host',
    'port',
    'streamName',
    'baseUrl',
    'url',
    'usingJwt',
    'b64_jwt_access_url',
    'jwt',
    'usingHash',
    'b64_hash_access_url',
    'hash',
  ];

  static getProtocolFromUrl (url) {
    // Chrome is the only browser that allows non-http protocols in the anchor
    // tag's href, so we cannot use document.createElement('a') as a parser.

    if (url.substring(0, 9).toLowerCase() === 'clsps-jwt') {
      return 'clsps-jwt';
    }

    if (url.substring(0, 8).toLowerCase() === 'clsp-jwt') {
      return 'clsp-jwt';
    }

    if (url.substring(0, 10).toLowerCase() === 'clsps-hash') {
      return 'clsps-hash';
    }

    if (url.substring(0, 9).toLowerCase() === 'clsp-hash') {
      return 'clsp-hash';
    }

    if (url.substring(0, 5).toLowerCase() === 'clsps') {
      return 'clsps';
    }

    if (url.substring(0, 4).toLowerCase() === 'clsp') {
      return 'clsp';
    }

    throw new Error('The given source is not a clsp url, and therefore cannot be parsed.');
  }

  /**
   * Determine whether a given CLSP protocol is secure.
   *
   * @param {String} protocol
   *   The protocol to make a determination about whether or not it is secure
   *
   * @returns {Boolean}
   *   true - if the protocol is secure
   *   false - if the protocol is not secure
   */
  static isSecureProtocol (protocol) {
    switch (protocol) {
      case 'clsps-jwt':
      case 'clsps-hash':
      case 'clsps': {
        return true;
      }
      case 'clsp-jwt':
      case 'clsp-hash':
      case 'clsp': {
        return false;
      }
      default: {
        throw new Error('The given source is not a clsp url, and therefore cannot be parsed.');
      }
    }
  }

  static generateSourcePropsFromUrl (rawUrl) {
    if (!rawUrl) {
      throw new Error('No source was given to be parsed!');
    }

    // base
    const protocol = Source.getProtocolFromUrl(rawUrl);
    const useSSL = Source.isSecureProtocol(protocol);
    let host = '';
    let port = '';
    let streamName = '';
    let baseUrl = '';
    let url = '';
    // jwt
    const usingJwt = protocol.endsWith('jwt');
    let b64_jwt_access_url = '';
    let jwt = '';
    // hash
    const usingHash = protocol.endsWith('hash');
    let b64_hash_access_url = '';
    let hash = '';

    // We use an anchor tag here beacuse, when an href is added to
    // an anchor dom Element, the parsing is done for you by the
    // browser.
    const parser = document.createElement('a');

    // Chrome is the only browser that allows non-http protocols in the anchor
    // tag's href, so change them all to http here so we get the benefits of the
    // anchor tag's parsing.  Also, if the protocol is not http, the hostname
    // will not be properly parsed.
    const hrefProtocol = useSSL
      ? 'https'
      : 'http';
    parser.href = rawUrl.replace(protocol, hrefProtocol);

    host = parser.hostname;

    // @ is a special address meaning the server that loaded the web page.
    if (host === '@') {
      host = window.location.hostname;
    }

    port = parser.port;

    if (!port) {
      port = useSSL
        ? Source.SSL_PORT
        : Source.DEFAULT_PORT;
    }

    port = parseInt(port);

    const paths = parser.pathname.split('/');

    streamName = paths[paths.length - 1];

    baseUrl = `${protocol}://${host}:${port}`;

    if (usingJwt === true) {
      // Url: clsp[s]-jwt://<sfs addr>[:9001]/<jwt>?Start=...&End=...
      const qp_offset = rawUrl.indexOf(parser.pathname) + parser.pathname.length;

      const qr_args = rawUrl.substr(qp_offset).split('?')[1];
      const query = {};

      const pairs = qr_args.split('&');
      for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
      }

      if (typeof query.Start === 'undefined') {
        throw new Error("Required 'Start' query parameter not defined for a clsp[s]-jwt");
      }

      if (typeof query.End === 'undefined') {
        throw new Error("Required 'End' query parameter not defined for a clsp[s]-jwt");
      }

      if (typeof query.token === 'undefined') {
        throw new Error("Required 'token' query parameter not defined for a clsp[s]-jwt");
      }

      url = `${baseUrl}/jwt?Start=${query.Start}&End=${query.End}`;
      b64_jwt_access_url = window.btoa(url);
      jwt = query.token;
    }

    else if (usingHash === true) {
      // URL: clsp[s]-hash://<sfs-addr>[:9001]/<stream>?start=...&end=...&token=...
      const qp_offset = rawUrl.indexOf(parser.pathname) + parser.pathname.length;

      const qr_args = rawUrl.substr(qp_offset).split('?')[1];
      const query = {};

      const pairs = qr_args.split('&');
      for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
      }

      if (typeof query.start === 'undefined') {
        throw new Error("Required 'start' query parameter not defined for a clsp[s]-hash");
      }

      if (typeof query.end === 'undefined') {
        throw new Error("Required 'end' query parameter not defined for a clsp[s]-hash");
      }

      if (typeof query.token === 'undefined') {
        throw new Error("Required 'token' query parameter not defined for a clsp[s]-hash");
      }

      url = `${baseUrl}/${streamName}?start=${query.start}&end=${query.end}&token=${query.token}`;
      b64_hash_access_url = window.btoa(url);
      hash = query.token;
    }

    else {
      url = `${baseUrl}/${streamName}`;
    }

    return {
      // base
      useSSL,
      host,
      port,
      streamName,
      baseUrl,
      url,
      // jwt
      usingJwt,
      b64_jwt_access_url,
      jwt,
      // hash
      usingHash,
      b64_hash_access_url,
      hash,
    };
  }

  static isSource (source) {
    if (typeof source !== 'object') {
      return false;
    }

    const propertiesCount = Source.PROPERTIES.length;

    for (let i = 0; i < propertiesCount; i++) {
      if (!Object.prototype.hasOwnProperty.call(source, Source.PROPERTIES[i])) {
        return false;
      }
    }

    return true;
  }

  static factory (config = {}) {
    return new Source(config);
  }

  static fromUrl (url) {
    return Source.factory(Source.generateSourcePropsFromUrl(url));
  }

  constructor (config = {}) {
    const {
      // base
      useSSL,
      host,
      port,
      streamName,
      baseUrl,
      url,
      // jwt
      usingJwt,
      b64_jwt_access_url,
      jwt,
      // hash
      usingHash,
      b64_hash_access_url,
      hash,
    } = config;

    // base
    this.useSSL = useSSL;
    this.host = host;
    this.port = port;
    this.streamName = streamName;
    this.baseUrl = baseUrl;
    this.url = url;
    // jwt
    this.usingJwt = usingJwt;
    this.b64_jwt_access_url = b64_jwt_access_url;
    this.jwt = jwt;
    // hash
    this.usingHash = usingHash;
    this.b64_hash_access_url = b64_hash_access_url;
    this.hash = hash;
  }

  clone () {
    return Source.factory({
      // base
      useSSL: this.useSSL,
      host: this.host,
      port: this.port,
      streamName: this.streamName,
      baseUrl: this.baseUrl,
      url: this.url,
      // jwt
      usingJwt: this.usingJwt,
      b64_jwt_access_url: this.b64_jwt_access_url,
      jwt: this.jwt,
      // hash
      usingHash: this.usingHash,
      b64_hash_access_url: this.b64_hash_access_url,
      hash: this.hash,
    });
  }

  /**
   * This indicates whether or not a source is capable of reusing the same
   * conduit.
   *
   * @param {Source} source
   *   The source to check for the same host
   *
   * @returns {Boolean}
   *   true - if all host properties match
   *   false - if any host property does not match
   */
  hostsMatch (source) {
    if (!Source.isSource(source)) {
      throw new Error('Cannot compare a source against something that is not a source');
    }

    if (this.host !== source.host) {
      return false;
    }

    if (this.port !== source.port) {
      return false;
    }

    return true;
  }
}
