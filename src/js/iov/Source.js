'use strict';

export default class Source {
  static DEFAULT_PORT = 9001;

  static SSL_PORT = 443;

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
    parser.href = rawUrl.replace(protocol, useSSL ? 'https' : 'http');

    // --- host
    host = parser.hostname;

    // @ is a special address meaning the server that loaded the web page.
    if (host === '@') {
      host = window.location.hostname;
    }

    // --- port
    port = parser.port;

    if (!port) {
      port = useSSL
        ? Source.SSL_PORT
        : Source.DEFAULT_PORT;
    }

    port = parseInt(port);

    // --- streamName
    const paths = parser.pathname.split('/');

    streamName = paths[paths.length - 1];

    // --- jwt
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

      url = `${protocol}://${host}:${port}/jwt?Start=${query.Start}&End=${query.End}`;
      b64_jwt_access_url = window.btoa(url);
      jwt = query.token;
    }

    // --- hash
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

      url = `${protocol}://${host}:${port}/${streamName}?start=${query.start}&end=${query.end}&token=${query.token}`
      b64_hash_access_url = window.btoa(url);
      hash = query.token;
    }

    // --- URL
    else {
      url = `${protocol}://${host}${port ? `:${port}` : ''}/${streamName}`;
    }

    return {
      // base
      useSSL,
      host,
      port,
      streamName,
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

  static fromUrl (url) {
    return Source.factory(Source.generateSourcePropsFromUrl(url));
  }

  static factory (config = {}) {
    return new Source(config);
  }

  constructor (config = {}) {
    const {
      // base
      useSSL,
      host,
      port,
      streamName,
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
}
