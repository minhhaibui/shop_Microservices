const keyTokenModel = require("../models/key.token.model");
const { Types } = require("mongoose");
class keyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      //level 0
      // const publicKeyString = publicKey.toString();
      // const token = await keyTokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey,
      // });
      // return token ? token.publicKey : null;
      const fitter = { user: userId },
        update = { publicKey, privateKey, refreshTokensUsed: [], refreshToken },
        option = { upsert: true, new: true };
      const tokens = await keyTokenModel.findOneAndUpdate(
        fitter,
        update,
        option
      );

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };
  static findByUserId = async (userId) => {
    return await keyTokenModel.findOne({ user: new Types.ObjectId(userId) });
  };
  static removeKeyById = async (id) => {
    const result = await keyTokenModel.deleteOne({
      _id: new Types.ObjectId(id),
    });
    return result;
  };
  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModel
      .findOne({ refreshTokensUsed: refreshToken })
      .lean();
  };
  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshToken }).lean();
  };
  static removeKeyByUserId = async (userId) => {
    const result = await keyTokenModel.deleteOne({
      user: new Types.ObjectId(userId),
    });
    return result;
  };
}
module.exports = keyTokenService;
