import { Router } from "express";
import { verifyAccessToken } from "../utils/verifyRefreshToken";
const router = Router();

router.get("/posts", async (req, res) => {
  try {
    if (!req.header.Authorization)
      return res
        .status(401)
        .json({ error: true, message: "access token is missing" });
    verifyAccessToken(req.header.Authorization);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

export default router;
