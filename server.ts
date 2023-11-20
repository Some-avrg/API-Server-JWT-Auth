import express from "express";
import { config } from "dotenv";
import dbConnect from "./dbConnect";
import authRoutes from "./routes/auth";
import refreshTokenRoutes from "./routes/refreshToken";
import cookieParser from 'cookie-parser';

const app = express();

config();
dbConnect();

app.use(express.json());
app.use(cookieParser());

app.use("/api", authRoutes);
app.use("/api/refreshToken", refreshTokenRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));