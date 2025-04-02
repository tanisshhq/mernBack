const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

dotenv.config();
app.use(express.json());
app.use(cors()); // Enable CORS for frontend requests

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "blog_uploads",
    format: async (req, file) => "png",
    public_id: (req, file) => file.originalname,
  },
});

const upload = multer({ storage });

// Image Upload Route
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json({ message: "File uploaded successfully", url: req.file.path });
});

// Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);

// Use dynamic port allocation for Render
const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.status(200).send("Backend is running!");
});

app.listen(PORT, () => {
  console.log(`Backend is running on port ${PORT}`);
});
