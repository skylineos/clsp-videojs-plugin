
export default class StreamConfiguration {
  static factory (streamName, host, port, useSSL, tokenConfig) {
    return new StreamConfiguration(streamName, host, port, useSSL, tokenConfig);
  }

  static fromObject (config) {
    if (!config || !typeof config === 'object') {
      throw new Error('config must be an object to create a streamConfiguration');
    }

    return StreamConfiguration.factory(
      config.streamName,
      config.host,
      config.port,
      config.useSSL,
      {
        ...config.tokenConfig
      },
    );
  }

  static isStreamConfiguration (target) {
    return target && target.constructor && target.constructor.name === 'StreamConfiguration';
  }

  static generateConfigFromUrl(url) {
    if (!url) {
      throw new Error('No source was given to be parsed!');
    }

    // We use an anchor tag here beacuse, when an href is added to
    // an anchor dom Element, the parsing is done for you by the
    // browser.
    const parser = document.createElement('a');

    let useSSL;
    let default_port;
    let jwtUrl;
    let hashUrl;
    let b64_jwt_access_url = '';
    let jwt = '';
    let b64_hash_access_url = '';
    let hash = '';

    // Chrome is the only browser that allows non-http protocols in
    // the anchor tag's href, so change them all to http here so we
    // get the benefits of the anchor tag's parsing
    if (url.substring(0, 9).toLowerCase() === 'clsps-jwt') {
      useSSL = true;
      parser.href = url.replace('clsps-jwt', 'https');
      default_port = 443;
      jwtUrl = true;
      hashUrl = false;
    } else if (url.substring(0, 8).toLowerCase() === 'clsp-jwt') {
      useSSL = false;
      parser.href = url.replace('clsp-jwt', 'http');
      default_port = 9001;
      jwtUrl = true;
      hashUrl = false;
    } else if (url.substring(0, 10).toLowerCase() === 'clsps-hash') {
      useSSL = true;
      parser.href = url.replace('clsps-hash', 'https');
      default_port = 443;
      jwtUrl = false;
      hashUrl = true;
    } else if (url.substring(0, 9).toLowerCase() === 'clsp-hash') {
      useSSL = false;
      parser.href = url.replace('clsp-hash', 'http');
      default_port = 9001;
      jwtUrl = false;
      hashUrl = true;
    } else if (url.substring(0, 5).toLowerCase() === 'clsps') {
      useSSL = true;
      parser.href = url.replace('clsps', 'https');
      default_port = 443;
      jwtUrl = false;
      hashUrl = false;
    } else if (url.substring(0, 4).toLowerCase() === 'clsp') {
      useSSL = false;
      parser.href = url.replace('clsp', 'http');
      default_port = 9001;
      jwtUrl = false;
      hashUrl = false;
    } else {
      throw new Error('The given source is not a clsp url, and therefore cannot be parsed.');
    }

    const paths = parser.pathname.split('/');
    const streamName = paths[paths.length - 1];

    let host = parser.hostname;
    let port = parser.port;

    if (port.length === 0) {
      port = default_port;
    }

    port = parseInt(port);

    // @ is a special address meaning the server that loaded the web page.
    if (host === '@') {
      host = window.location.hostname;
    }

    // if jwt extract required url parameters.
    if (jwtUrl === true) {
      // Url: clsp[s]-jwt://<sfs addr>[:9001]/<jwt>?Start=...&End=...
      const qp_offset = url.indexOf(parser.pathname) + parser.pathname.length;

      const qr_args = url.substr(qp_offset).split('?')[1];
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

      const protocol = useSSL ?
        'clsps-jwt' :
        'clsp-jwt';

      const jwtUrl = `${protocol}://${host}:${port}/jwt?Start=${query.Start}&End=${query.End}`;

      b64_jwt_access_url = window.btoa(jwtUrl);
      jwt = query.token;
    } else if (hashUrl === true) {
      // URL: clsp[s]-hash://<sfs-addr>[:9001]/<stream>?start=...&end=...&token=...
      const qp_offset = url.indexOf(parser.pathname) + parser.pathname.length;

      const qr_args = url.substr(qp_offset).split('?')[1];
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

      const protocol = useSSL ?
        'clsps-hash' :
        'clsp-hash';

      const hashUrl = `${protocol}://${host}:${port}/${streamName}?start=${query.start}&end=${query.end}&token=${query.token}`

      b64_hash_access_url = window.btoa(hashUrl);
      hash = query.token;
    }

    return {
      streamName,
      host,
      port,
      useSSL,
      tokenConfig: {
        b64_jwt_access_url,
        jwt,
        b64_hash_access_url,
        hash,
      },
    };
  }

  static fromUrl (url) {
    const config = StreamConfiguration.generateConfigFromUrl(url);

    console.log(config)

    return StreamConfiguration.fromObject(config);
  }

  constructor (streamName, host, port, useSSL, tokenConfig = {}) {
    if (!streamName) {
      throw new Error('streamName is required to create a stream configuration.');
    }

    if (!host) {
      throw new Error('host is required to create a stream configuration.');
    }

    if (!port) {
      throw new Error('port is required to create a stream configuration.');
    }

    if (!useSSL && useSSL !== false) {
      throw new Error('useSSL is required to create a stream configuration.');
    }

    if (!tokenConfig || typeof tokenConfig !== 'object') {
      throw new Error('tokenConfig is required to create a stream configuration.');
    }

    this.streamName = streamName;
    this.host = host;
    this.port = port;
    this.useSSL = useSSL;
    this.tokenConfig = tokenConfig;
  }

  clone (streamConfiguration) {
    if (!StreamConfiguration.isStreamConfiguration(streamConfiguration)) {
      throw new Error('Cannot clone with invalid streamConfiguration');
    }

    const clone = StreamConfiguration.factory(...streamConfiguration.toObject());

    return clone;
  }

  toObject () {
    return {
      streamName: streamConfiguration.streamName,
      host: streamConfiguration.host,
      port: streamConfiguration.port,
      useSSL: streamConfiguration.useSSL,
      tokenConfig: {
        ...streamConfiguration.tokenConfig,
      },
    };
  }
}
