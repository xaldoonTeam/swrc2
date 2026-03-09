import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth, requireAdmin, AuthRequest } from "../middleware/auth.js";
import { uploadImage, getFileUrl } from "../utils/upload.js";

const router = Router();
const prisma = new PrismaClient();

// ----- Public -----
router.get("/", async (_req, res) => {
  const list = await prisma.mediaItem.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  res.json(list);
});

// ----- Admin -----
router.get("/admin/list", requireAuth, requireAdmin, async (_req, res) => {
  const list = await prisma.mediaItem.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  res.json(list);
});

router.post("/", requireAuth, requireAdmin, uploadImage.single("thumbnail"), async (req: AuthRequest, res) => {
  const body = req.body as Record<string, string>;
  const title = body.title?.trim();
  const type = body.type?.trim() ?? "Video";
  const description = body.description?.trim() || null;
  const duration = body.duration?.trim() || null;
  const views = parseInt(body.views, 10) || 0;
  const date = body.date?.trim() || null;
  const youtubeId = body.youtubeId?.trim() || null;
  const mediaType = (body.mediaType?.trim() || "video") as "video" | "photo";
  const sortOrder = parseInt(body.sortOrder, 10) || 0;

  if (!title) {
    res.status(400).json({ error: "Title is required" });
    return;
  }

  let thumbnailUrl: string | null = null;
  if (req.file?.filename) {
    thumbnailUrl = getFileUrl(req.file.filename, "images");
  }

  const item = await prisma.mediaItem.create({
    data: {
      title,
      type,
      description,
      duration,
      views,
      date,
      youtubeId,
      thumbnailUrl,
      mediaType,
      sortOrder,
    },
  });
  res.status(201).json(item);
});

router.get("/:id", async (req, res) => {
  const item = await prisma.mediaItem.findUnique({
    where: { id: req.params.id },
  });
  if (!item) {
    res.status(404).json({ error: "Media item not found" });
    return;
  }
  res.json(item);
});

router.put("/:id", requireAuth, requireAdmin, uploadImage.single("thumbnail"), async (req: AuthRequest, res) => {
  const { id } = req.params;
  const existing = await prisma.mediaItem.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ error: "Media item not found" });
    return;
  }

  const body = req.body as Record<string, string>;
  const title = body.title?.trim() ?? existing.title;
  const type = body.type?.trim() ?? existing.type;
  const description = body.description?.trim() || null;
  const duration = body.duration?.trim() || null;
  const views = parseInt(body.views, 10) ?? existing.views;
  const date = body.date?.trim() || null;
  const youtubeId = body.youtubeId?.trim() || null;
  const mediaType = (body.mediaType?.trim() || existing.mediaType) as "video" | "photo";
  const sortOrder = parseInt(body.sortOrder, 10) ?? existing.sortOrder;

  let thumbnailUrl = existing.thumbnailUrl;
  if (req.file?.filename) {
    thumbnailUrl = getFileUrl(req.file.filename, "images");
  }

  const item = await prisma.mediaItem.update({
    where: { id },
    data: {
      title,
      type,
      description,
      duration,
      views,
      date,
      youtubeId,
      thumbnailUrl,
      mediaType,
      sortOrder,
    },
  });
  res.json(item);
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;
  await prisma.mediaItem.delete({ where: { id } }).catch(() => null);
  res.status(204).send();
});

export default router;
