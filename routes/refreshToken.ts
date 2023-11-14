import { Router } from "express";
import UserToken from "../models/UserToken";
import jwt from "jsonwebtoken";
import { refreshTokenBodyValidation } from "../utils/validationSchema";
import verifyRefreshToken from "../utils/verifyRefreshToken";

const router = Router();

// get new access token
router.post("/", async (req, res) => {
  try{
  const { error } = refreshTokenBodyValidation(req.body);
  if (error)
    return res
      .status(400)
      .json({ error: true, message: error.details[0].message });

  verifyRefreshToken(req.body.refreshToken)
    .then(({ tokenDetails }) => {
      const payload = { _id: tokenDetails._id, roles: tokenDetails.roles };
      const accessToken = jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_PRIVATE_KEY,
        { expiresIn: "14m" }
      );
      res.status(200).json({
        error: false,
        accessToken,
        message: "Access token created successfully", 
      });
    })
    .catch((err) => res.status(400).json(err));
  }catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }

});

// logout
router.delete("/", async (req, res) => {
  try {
    const { error } = refreshTokenBodyValidation(req.body);
    if (error)
      return res
        .status(400)
        .json({ error: true, message: error.details[0].message });

    const userToken = await UserToken.findOne({ token: req.body.refreshToken });
    if (!userToken)
      return res
        .status(200)
        .json({ error: false, message: "You have already logged out" });

    await userToken.deleteOne({ token: req.body.refreshToken });
    
    res.status(200).json({ error: false, message: "Logged Out Sucessfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

export default router;
