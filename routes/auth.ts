import { Router } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import UserToken from "../models/UserToken";
import generateTokens from "../utils/generateTokens";
import {
  signUpBodyValidation,
  logInBodyValidation,
} from "../utils/validationSchema";

const router = Router();

// delete User
router.delete("/deleteUser", async (req, res) => {
  try {
    //Проверка на подлинность логина/пароля
    const { error } = logInBodyValidation(req.body);
    if (error)
      return res
        .status(400)
        .json({ error: true, message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password" });

    const verifiedPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!verifiedPassword)
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password" });

    //создаём новую пару токенов, чтобы старая стла недействительна
    const { accessToken, refreshToken } = await generateTokens(user);
    //удаляем пользователя из бд
    await User.deleteOne({ email: req.body.email });

    await UserToken.deleteOne({ token: refreshToken });

    res.status(200).json({
      error: false,
      message: "User deleted successfully",
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// update User
router.post("/updateUser", async (req, res) => {
    try {
      //Проверка на подлинность логина/пароля
      const { error } = signUpBodyValidation(req.body);
      if (error)
        return res
          .status(400)
          .json({ error: true, message: error.details[0].message });
  
      const user = await User.findOne({ email: req.body.email });
      if (!user)
        return res
          .status(401)
          .json({ error: true, message: "Invalid email or password" });
  
      const verifiedPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!verifiedPassword)
        return res
          .status(401)
          .json({ error: true, message: "Invalid email or password" });
  
      //обновляем имя пользователя
      await User.updateOne({ email: req.body.email }, {userName: req.body.userName});
  
      res.status(200).json({
        error: false,
        message: "Username updated successfully",
      });
  
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  });

// signup
router.post("/signUp", async (req, res) => {
  try {
    const { error } = signUpBodyValidation(req.body);
    if (error)
      return res
        .status(400)
        .json({ error: true, message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (user)
      return res
        .status(400)
        .json({ error: true, message: "User with given email already exist" });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    await new User({ ...req.body, password: hashPassword }).save();

    res
      .status(201)
      .json({ error: false, message: "Account created sucessfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// login
router.post("/logIn", async (req, res) => {
  try {
    const { error } = logInBodyValidation(req.body);
    if (error)
      return res
        .status(400)
        .json({ error: true, message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password" });

    const verifiedPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!verifiedPassword)
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password" });

    const { accessToken, refreshToken } = await generateTokens(user);

    res.status(200).json({
      error: false,
      accessToken,
      refreshToken,
      message: "Logged in sucessfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

export default router;
