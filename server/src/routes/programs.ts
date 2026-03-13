import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth, requireAdmin, AuthRequest } from "../middleware/auth.js";
import { uploadImage, getFileUrl } from "../utils/upload.js";

const router = Router();
const prisma = new PrismaClient();
const MAX_IMAGES = 10;

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

// ----- Public -----
router.get("/", async (_req, res) => {
  const list = await prisma.program.findMany({
    orderBy: { sortOrder: "asc" },
  });
  res.json(list);
});

// ----- Admin -----
router.get("/admin/list", requireAuth, requireAdmin, async (_req, res) => {
  const list = await prisma.program.findMany({ orderBy: { sortOrder: "asc" } });
  res.json(list);
});

router.post("/", requireAuth, requireAdmin, uploadImage.array("images", MAX_IMAGES), async (req: AuthRequest, res) => {
  const body = req.body as Record<string, string>;
  const title = body.title?.trim();
  const description = body.description?.trim() ?? "";
  const iconName = body.iconName?.trim() || null;
  const sortOrder = parseInt(body.sortOrder, 10) || 0;

  if (!title) {
    res.status(400).json({ error: "Title is required" });
    return;
  }

  const files = (req as unknown as { files?: Express.Multer.File[] }).files;
  const imageUrls = Array.isArray(files)
    ? files.map((f) => getFileUrl(f.filename, "images"))
    : [];

  const slug = slugify(title) + "-" + Date.now().toString(36);
  const item = await prisma.program.create({
    data: { title, slug, description, iconName, imageUrls, sortOrder },
  });
  res.status(201).json(item);
});

router.get("/:idOrSlug", async (req, res) => {
  const { idOrSlug } = req.params;
  const isCuid = idOrSlug.length === 25 && !idOrSlug.includes("-");
  const item = await prisma.program.findFirst({
    where: isCuid ? { id: idOrSlug } : { slug: idOrSlug },
  });
  if (!item) {
    res.status(404).json({ error: "Program not found" });
    return;
  }
  res.json(item);
});

router.put("/:id", requireAuth, requireAdmin, uploadImage.array("images", MAX_IMAGES), async (req: AuthRequest, res) => {
  const { id } = req.params;
  const existing = await prisma.program.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ error: "Program not found" });
    return;
  }

  const body = req.body as Record<string, string>;
  const title = body.title?.trim() ?? existing.title;
  const description = body.description?.trim() ?? existing.description;
  const iconName = body.iconName?.trim() || null;
  const sortOrder = parseInt(body.sortOrder, 10) ?? existing.sortOrder;

  const files = (req as unknown as { files?: Express.Multer.File[] }).files;
  let imageUrls: string[] = existing.imageUrls ?? [];
  const existingJson = body.existingImageUrls;
  if (typeof existingJson === "string") {
    try {
      const parsed = JSON.parse(existingJson) as unknown;
      imageUrls = Array.isArray(parsed) ? parsed.filter((u): u is string => typeof u === "string") : imageUrls;
    } catch {
      // keep current imageUrls
    }
  }
  if (Array.isArray(files) && files.length > 0) {
    const newUrls = files.map((f) => getFileUrl(f.filename, "images"));
    imageUrls = [...imageUrls, ...newUrls].slice(0, MAX_IMAGES);
  }

  const item = await prisma.program.update({
    where: { id },
    data: { title, description, iconName, imageUrls, sortOrder },
  });
  res.json(item);
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;
  await prisma.program.delete({ where: { id } }).catch(() => null);
  res.status(204).send();
});

export default router;
