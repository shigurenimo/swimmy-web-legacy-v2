const cors = require('cors');
const functions = require('firebase-functions');

const failureResponse = require('../helpers/failureResponse').default;
const getContext = require('../helpers/getContext').default;
const successResponse = require('../helpers/successResponse').default;
const updatePostTag = require('../methods/updatePostTag').default;

exports.default = functions.https.onRequest((request, response) => {
  return cors({origin: true})(request, response, () => {
    const args = getArguments(request);
    return getContext(request).
      then((user) => {
        return updatePostTag(args, user);
      }).
      then(() => {
        return successResponse(response);
      }).
      catch((err) => {
        return failureResponse(response, err);
      });
  });
});

const getArguments = (request) => {
  return {
    id: request.body.id,
    name: request.body.name || 'like',
  };
};
