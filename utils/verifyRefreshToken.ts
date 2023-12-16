import UserToken from "../models/UserToken";
import jwt from "jsonwebtoken";

const verifyRefreshToken = (refreshToken) => {
  try {
    const privateKey = process.env.REFRESH_TOKEN_PRIVATE_KEY;

    return new Promise(async (resolve, reject) => {
      const doc = await UserToken.findOne({ token: refreshToken });

      if (!doc)
        return reject({ error: true, message: "Invalid refresh token " });
      jwt.verify(refreshToken, privateKey, (err, tokenDetails) => {
        if (err)
          return reject({ error: true, message: "Invalid refresh token" });
        resolve({
          tokenDetails,
          error: false,
          message: "Valid refresh token",
        });
      });
    });
  } catch (err) {
    console.log(err);
  }
};

const verifyAccessToken = (accessToken) => {
  try {
    const privateKey = process.env.REFRESH_TOKEN_PRIVATE_KEY;

    return new Promise(async (resolve, reject) => {
      jwt.verify(accessToken, privateKey, (err, tokenDetails) => {
        if (err)
          return reject({ error: true, message: "Invalid access token" });
        resolve({
          tokenDetails,
          error: false,
          message: "Valid access token",
        });
      });
    });
  } catch (err) {
    console.log(err);
  }
};

export {verifyRefreshToken, verifyAccessToken};
