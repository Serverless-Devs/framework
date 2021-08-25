
import createRequest from './create-request';

import formatResponse from './format-response';

export default options => {
  return getResponse => async (event_, context = {}) => {

    const request = createRequest(event_, context, options);
    const response = await getResponse(request, event_, context);

    return formatResponse(event_, response, options);
  };
};
