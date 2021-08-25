'use strict';

const http = require('http');

export default class ServerlessRequest extends http.IncomingMessage {
  constructor({ method, url, headers, body, path, queries }) {
    super({
      encrypted: true,
      readable: false,
      address: () => ({ port: 443 }),
      end: Function.prototype,
      destroy: Function.prototype
    });

    if (typeof headers['content-length'] === 'undefined') {
      headers['content-length'] = Buffer.byteLength(body);
    }

    Object.assign(this, {
      complete: true,
      method,
      headers,
      body,
      url,
      path,
      queries,
    });

    this._read = () => {
      this.push(body);
      this.push(null);
    };
  }

}
