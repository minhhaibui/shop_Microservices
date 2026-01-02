const {createResponse, Ok, successResponse: successResponse} = require('../core/success.response');
const accessService = require('../services/access.service');

class accessController {
  login = async (req, res, next) => {
    new successResponse({
      metadata: await accessService.login(req.body),
    }).send(res);
  };
  singup = async (req, res, next) => {
    new createResponse({
      message: 'Registered Ok',
      metadata: await accessService.signup(req.body),
      option: {limit: 10},
    }).send(res);
  };
  logout = async (req, res, next) => {
    new successResponse({
      message: 'Logout success!',
      metadata: await accessService.logout(req.keyStore),
    }).send(res);
  };

  handlerRefreshToken = async (req, res, next) => {
    //v1
    // new successResponse({
    //   message: "get token success!",
    //   metadata: await accessService.handlerRefreshToken(req.body.refreshToken),
    // }).send(res);

    //v2 fixed, no need accessToken
    new successResponse({
      message: 'get token success!',
      metadata: await accessService.handlerRefreshTokenV2({
        keyStore: req.keyStore,
        user: req.user,
        refreshToken: req.refreshToken,
      }),
    }).send(res);
  };
}
module.exports = new accessController();
