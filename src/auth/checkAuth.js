const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};
const { findById } = require("../services/apikey.service");
const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({
        message: "forbiddenError",
      });
    }
    const objkey = await findById(key);
    if (!objkey) {
      return res.status(403).json({
        message: "forbiddenError",
      });
    }
    req.objkey = objkey;
    console.log("req.objkey:::", req.objkey);
    next();
  } catch (error) {
    console.log(error);
  }
};

const permission = (permissions) => {
  return (req, res, next) => {
    if (!req.objkey?.permissions) {
      return res.status(403).json({
        message: "permission denied",
      });
    }
    console.log("permission::", req.objkey);
    const validPermission = req.objkey?.permissions.includes(permissions);
    if (!validPermission) {
      return res.status(403).json({
        message: "permission denied",
      });
    }
    next();
  };
};
module.exports = { apiKey, permission };
