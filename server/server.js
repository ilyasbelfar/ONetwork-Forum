const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const topicRoutes = require("./routes/topicRoutes");
const commentRoutes = require("./routes/commentRoutes");
const userRoutes = require("./routes/userRoutes");

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(helmet());
app.use(fileUpload({ useTempFiles: true, tempFileDir: "./tmp" }));
app.use(
  cors({
    origin: process.env.REACT_APP_URL,
    credentials: true,
  })
);

app.use("/", authRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/user", userRoutes);

app.listen(PORT, () => {
  console.log("Server is running!");
});
