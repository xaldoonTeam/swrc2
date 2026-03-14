import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import publicationRoutes from "./routes/publications.js";
import researchRoutes from "./routes/research.js";
import programRoutes from "./routes/programs.js";
import storyRoutes from "./routes/stories.js";
import mediaRoutes from "./routes/media.js";
import settingsRoutes from "./routes/settings.js";
import usersRoutes from "./routes/users.js";
import newsletterRoutes from "./routes/newsletters.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT ?? 3001;
const uploadDir = process.env.UPLOAD_DIR ?? "uploads";
const uploadPath = path.join(__dirname, "..", uploadDir);

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());

// Serve uploaded files (PDFs, images)
app.use("/uploads", express.static(uploadPath));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/publications", publicationRoutes);
app.use("/api/research", researchRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/newsletters", newsletterRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "SWRC API" });
});

app.listen(PORT, () => {
  console.log(`SWRC API running at http://localhost:${PORT}`);
});
