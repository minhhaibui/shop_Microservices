const shopModel = require("../models/shop.model.js");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const keyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils.js");
const { getInfoData } = require("../utils/index.js");

const {
  forbiddenRequestError,
  badRequestError,
  AuthFailureError,
} = require("../core/error.response.js");
const { findByEmail } = require("./shop.service.js");
const keyTokenModel = require("../models/key.token.model.js");

const roleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};
class accessService {
  static login = async ({ email, password, refreshToken = null }) => {
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new badRequestError("Shop not registed");

    const matchPassWord = await bcrypt.compare(password, foundShop.password);
    if (!matchPassWord) return AuthFailureError("authentication error");

    const publicKey = crypto.randomBytes(64).toString("hex");
    const privateKey = crypto.randomBytes(64).toString("hex");
    const { _id: userId } = foundShop;
    const tokens = await createTokenPair(
      { userId, email },
      privateKey,
      publicKey
    );

    await keyTokenService.createKeyToken({
      userId,
      refreshToken: tokens.refreshToken,
      publicKey,
      privateKey,
    });
    return {
      shop: getInfoData({
        fileds: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };

  static signup = async ({ name, email, password }) => {
    // try {
    const holderShop = await shopModel.findOne({ email }).lean();

    if (holderShop) {
      throw new forbiddenRequestError("Error:shop already register!!!");
      // return {
      //   status: "xxxx",
      //   message: "shop already register!!!",
      // };
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      role: roleShop.SHOP,
    });
    if (newShop) {
      // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      //   privateKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      // });
      const publicKey = crypto.randomBytes(64).toString("hex");
      const privateKey = crypto.randomBytes(64).toString("hex");
      console.log({ publicKey, privateKey });
      const keyStore = await keyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });
      if (!keyStore) {
        return {
          code: "aaaa",
          message: "keyStore error",
        };
      }

      // const publickeyObject = crypto.createPublicKey(publicKeyString);
      //create accessToken ,refreshToken
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        privateKey,
        publicKey
      );
      console.log("create token success", tokens);
      return {
        shop: getInfoData({
          fileds: ["_id", "name", "email"],
          object: newShop,
        }),
        tokens,
      };
    }
    return {
      code: 201,
      metaData: null,
    };
    // } catch (error) {
    //   return {
    //     code: "bbb",
    //     message: error.message,
    //     status: "error",
    //   };
    // }
  };

  static logout = async (keyStore) => {
    const delKey = await keyTokenService.removeKeyById(keyStore._id);
    console.log({ delKey });
    return delKey;
  };

  static handlerRefreshTokenV2 = async ({ refreshToken, user, keyStore }) => {
    const { userId, email } = user;

    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await keyTokenService.removeKeyByUserId(userId);
      throw new forbiddenRequestError(
        "something wrong happend !! ples relogin"
      );
    }

    if (keyStore.refreshToken !== refreshToken)
      throw new AuthFailureError("shop not registed");

    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError("shop not registed ");
    //create new AT RT
    const tokens = await createTokenPair(
      { userId, email },
      keyStore.privateKey,
      keyStore.publicKey
    );

    await keyTokenModel.updateOne(
      { _id: keyStore._id }, // Điều kiện tìm kiếm
      {
        $set: {
          refreshToken: tokens.refreshToken,
        },
        $addToSet: {
          refreshTokensUsed: refreshToken,
        },
      }
    );
    return {
      user,
      tokens,
    };
  };

  static handlerRefreshToken = async (refreshToken) => {
    const foundRefreshToken = await keyTokenService.findByRefreshTokenUsed(
      refreshToken
    );
    if (foundRefreshToken) {
      //decode? => who are you
      const { userId, email } = await verifyJWT(
        refreshToken,
        foundRefreshToken.privateKey
      );
      console.log("1111111111111111", { userId, email });
      //delete
      await keyTokenService.removeKeyByUserId(userId);
      throw new forbiddenRequestError(
        "something wrong happend !! ples relogin"
      );
    }

    const holderToken = await keyTokenService.findByRefreshToken(refreshToken);
    console.log({ holderToken });

    if (!holderToken) throw new AuthFailureError("shop not registed");

    const { userId, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey
    );
    console.log("[2]----", { userId, email });
    const foundShop = await findByEmail({ email });
    console.log({ foundShop });
    if (!foundShop) throw new AuthFailureError("shop not registed 2");
    //create new AT RT
    const tokens = await createTokenPair(
      { userId, email },
      holderToken.privateKey,
      holderToken.publicKey
    );

    await keyTokenModel.updateOne(
      { _id: holderToken._id }, // Điều kiện tìm kiếm
      {
        $set: {
          refreshToken: tokens.refreshToken,
        },
        $addToSet: {
          refreshTokensUsed: refreshToken,
        },
      }
    );
    return {
      user: { userId, email },
      tokens,
    };
  };
}

module.exports = accessService;
