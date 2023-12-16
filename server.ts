import express from "express";
import { config } from "dotenv";
import dbConnect from "./dbConnect";
import authRoutes from "./routes/auth";
import refreshTokenRoutes from "./routes/refreshToken";
import appRoutes from "./routes/app";
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

config();
dbConnect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
      credentials: true,
      origin: true,
  })
);
 
app.use("/api", appRoutes);
app.use("/api", authRoutes);
app.use("/api/refreshToken", refreshTokenRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));