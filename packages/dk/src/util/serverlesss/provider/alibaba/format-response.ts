'use strict';

import Response from '../../response';
import isBinary from './is-binary';
import sanitizeHeaders from './sanitize-headers';

export default (event, response, options) => {
  const { statusCode } = response;
  const { headers } = sanitizeHeaders(Response.headers(response));

  if (headers['transfer-encoding'] === 'chunked' || response.chunkedEncoding) {
    throw new Error('chunked encoding not supported');
  }

  const isBase64Encoded = isBinary(headers, options);
  const encoding = isBase64Encoded ? 'base64' : 'utf8';
  const body = Response.body(response).toString(encoding);
  return { code: statusCode, headers, isBase64Encoded, data: body };
};
