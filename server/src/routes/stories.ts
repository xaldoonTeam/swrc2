import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth, requireAdmin, AuthRequest } from "../middleware/auth.js";
import { uploadImage, getFileUrl } from "../utils/upload.js";

const router = Router();
const prisma = new PrismaClient();

// ----- Public -----
router.get("/", async (_req, res) => {
  const list = await prisma.story.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(list);
});

// ----- Admin -----
router.get("/admin/list", requireAuth, requireAdmin, async (_req, res) => {
  const list = await prisma.story.findMany({ orderBy: { createdAt: "desc" } });
  res.json(list);
});

router.post("/", requireAuth, requireAdmin, uploadImage.single("image"), async (req: AuthRequest, res) => {
  const body = req.body as Record<string, string>;
  const name = body.name?.trim();
  const role = body.role?.trim() ?? "";
  const category = body.category?.trim() ?? "";
  const story = body.story?.trim() ?? "";
  const published = body.published !== "false";

  if (!name) {
    res.status(400).json({ error: "Name is required" });
    return;
  }

  let imageUrl: string | null = null;
  if (req.file?.filename) {
    imageUrl = getFileUrl(req.file.filename, "images");
  }

  const item = await prisma.story.create({
    data: { name, role, category, story, imageUrl, published },
  });
  res.status(201).json(item);
});

router.get("/:id", async (req, res) => {
  const item = await prisma.story.findUnique({
    where: { id: req.params.id },
  });
  if (!item || !item.published) {
    res.status(404).json({ error: "Story not found" });
    return;
  }
  res.json(item);
});

router.put("/:id", requireAuth, requireAdmin, uploadImage.single("image"), async (req: AuthRequest, res) => {
  const { id } = req.params;
  const existing = await prisma.story.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ error: "Story not found" });
    return;
  }

  const body = req.body as Record<string, string>;
  const name = body.name?.trim() ?? existing.name;
  const role = body.role?.trim() ?? existing.role;
  const category = body.category?.trim() ?? existing.category;
  const story = body.story?.trim() ?? existing.story;
  const published = body.published !== "false";

  let imageUrl = existing.imageUrl;
  if (req.file?.filename) {
    imageUrl = getFileUrl(req.file.filename, "images");
  }

  const item = await prisma.story.update({
    where: { id },
    data: { name, role, category, story, imageUrl, published },
  });
  res.json(item);
});

router.patch("/:id", requireAuth, requireAdmin, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const body = req.body as { published?: boolean };
  const existing = await prisma.story.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ error: "Story not found" });
    return;
  }
  const published = body.published === true;
  const item = await prisma.story.update({
    where: { id },
    data: { published },
  });
  res.json(item);
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;
  await prisma.story.delete({ where: { id } }).catch(() => null);
  res.status(204).send();
});

export default router;
