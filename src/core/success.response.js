const {StatusCodes, ReasonPhrases} = require('./statusCode/httpStatusCode');

class successResponse {
  constructor({
    message,
    statusCode = StatusCodes.OK,
    reasonStatusCode = ReasonPhrases.OK,
    metadata = {},
  }) {
    (this.message = message ? message : reasonStatusCode),
      (this.status = statusCode),
      (this.metadata = metadata);
  }
  send(res, headers = {}) {
    return res.status(this.status).json(this);
  }
}

class Ok extends successResponse {
  constructor({message, metadata}) {
    super({message, metadata});
  }
}
class createResponse extends successResponse {
  constructor({
    message,
    statusCode = StatusCodes.CREATED,
    reasonStatusCode = ReasonPhrases.CREATED,
    metadata,
    option = {},
  }) {
    super({message, statusCode, reasonStatusCode, metadata});
    this.option = option;
  }
}

module.exports = {Ok, createResponse: createResponse, successResponse: successResponse};
