import { Router } from "express";
import UserToken from "../models/UserToken";
import jwt from "jsonwebtoken";
import { verifyRefreshToken } from "../utils/verifyRefreshToken";
import generateTokens from "../utils/generateTokens";

const router = Router();

// get new access token
router.post("/", async (req, res) => {
  try {
    if (!req.body.refreshToken) 
      return res
        .status(400)
        .json({ error: true, message: "refresh token not found" });

    verifyRefreshToken(req.body.refreshToken)
      .then(async ({ tokenDetails, error, message }) => {
        //создаём новую пару токенов, чтобы старая стaла недействительна
        const { accessToken, refreshToken } =
          await generateTokens(tokenDetails);

        res.status(200).json({
          error: false,
          accessToken,
          refreshToken,
          message: "New access token created successfully",
        });
      })
      .catch((err) => res.status(400).json(err));
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

export default router;
