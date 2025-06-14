import express from "express";
import mongoose from "mongoose";
import cors from "cors"; // 👈 add this line

const app = express();
const PORT = process.env.PORT || 5000;

// --- CORS Middleware ---
const allowedOrigins = [
  "http://localhost:3000", 
  "https://kffgc.vercel.app" // 👈 replace with your actual deployed domain
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));

// --- Inline Mongoose Schema ---
const contributorSchema = new mongoose.Schema({
  tname: String,
  logo: String,
  iglink: String,
  mobno: [String],
});
const Contributor = mongoose.model("Contributor", contributorSchema, "gandesp");

// --- Middleware ---
app.use(express.json());

// --- API Route ---
app.get("/api/contributors", async (req, res) => {
  try {
    const contributors = await Contributor.find();
    res.json(contributors);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch contributors" });
  }
});

// --- MongoDB Connection ---
mongoose.connect("mongodb+srv://kffgcadmin:adminkffgc@cluster0.7iwi7uc.mongodb.net/members?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("✅ MongoDB connected");
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error("❌ MongoDB connection failed:", err);
});
