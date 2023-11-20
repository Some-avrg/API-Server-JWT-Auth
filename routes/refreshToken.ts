import { Router } from "express";
import UserToken from "../models/UserToken";
import jwt from "jsonwebtoken";
import { refreshTokenBodyValidation } from "../utils/validationSchema";
import verifyRefreshToken from "../utils/verifyRefreshToken";
import generateTokens from "../utils/generateTokens";

const router = Router();

// get new access token
router.post("/", async (req, res) => {
  try {
    if (!req.cookies.jwt)
      return res
        .status(400)
        .json({ error: true, message: "jwt token not found" });

    //res.clearCookie("jwt");

    verifyRefreshToken(req.cookies.jwt)
      .then(async ({ tokenDetails, error, message }) => {
        //создаём новую пару токенов, чтобы старая стaла недействительна
        const { accessToken, refreshToken } =
          await generateTokens(tokenDetails);

        res.cookie("jwt", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "Strict",
          maxAge: 604800000, //7 days
        });
        res.status(200).json({
          error: false,
          accessToken,
          message: "New access token created successfully",
        });
      })
      .catch((err) => res.status(400).json(err));
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// logout
router.delete("/", async (req, res) => {
  try {
    if (!req.cookies.jwt)
    return res
      .status(400)
      .json({ error: true, message: "jwt token not found" });

    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });
    const userToken = await UserToken.findOne({ token: req.cookies.jwt });
    if (!userToken)
      return res
        .status(200)
        .json({ error: false, message: "You have already logged out" });

    await userToken.deleteOne({ token: req.cookies.jwt });

    res.status(200).json({ error: false, message: "Logged Out Sucessfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

export default router;
