import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth, requireAdmin, AuthRequest } from "../middleware/auth.js";
import { uploadImage, getFileUrl } from "../utils/upload.js";

const router = Router();
const prisma = new PrismaClient();

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

// ----- Admin: list all (must be before /:idOrSlug) -----
router.get("/admin/list", requireAuth, requireAdmin, async (_req, res) => {
  const list = await prisma.newsletter.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json(list);
});

// ----- Public: list published -----
router.get("/", async (_req, res) => {
  const list = await prisma.newsletter.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(list);
});

// ----- Admin: create -----
router.post("/", requireAuth, requireAdmin, uploadImage.single("image"), async (req: AuthRequest, res) => {
  const body = req.body as Record<string, string>;
  const title = body.title?.trim();
  const summary = body.summary?.trim() || null;
  const content = body.content?.trim() || "";
  const published = body.published === "true";

  if (!title) {
    res.status(400).json({ error: "Title is required" });
    return;
  }

  let imageUrl: string | null = null;
  if (req.file?.filename) {
    imageUrl = getFileUrl(req.file.filename, "images");
  }

  const slug = slugify(title) + "-" + Date.now().toString(36);

  const item = await prisma.newsletter.create({
    data: { title, slug, summary, content, imageUrl, published },
  });
  res.status(201).json(item);
});

// ----- Public: get one by id or slug -----
router.get("/:idOrSlug", async (req, res) => {
  const { idOrSlug } = req.params;
  const isCuid = idOrSlug.length === 25 && !idOrSlug.includes("-");
  const item = await prisma.newsletter.findFirst({
    where: isCuid ? { id: idOrSlug } : { slug: idOrSlug },
  });
  if (!item) {
    res.status(404).json({ error: "Newsletter not found" });
    return;
  }
  if (!item.published) {
    res.status(404).json({ error: "Newsletter not found" });
    return;
  }
  res.json(item);
});

// ----- Admin: update -----
router.put("/:id", requireAuth, requireAdmin, uploadImage.single("image"), async (req: AuthRequest, res) => {
  const { id } = req.params;
  const body = req.body as Record<string, string>;
  const existing = await prisma.newsletter.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ error: "Newsletter not found" });
    return;
  }

  const title = body.title?.trim() ?? existing.title;
  const summary = body.summary?.trim() ?? existing.summary;
  const content = body.content?.trim() ?? existing.content;
  const published = body.published === "true";

  let imageUrl = existing.imageUrl;
  if (req.file?.filename) {
    imageUrl = getFileUrl(req.file.filename, "images");
  }

  const item = await prisma.newsletter.update({
    where: { id },
    data: { title, summary, content, imageUrl, published },
  });
  res.json(item);
});

// ----- Admin: update published only -----
router.patch("/:id", requireAuth, requireAdmin, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const body = req.body as { published?: boolean };
  const existing = await prisma.newsletter.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ error: "Newsletter not found" });
    return;
  }
  const published = body.published === true;
  const item = await prisma.newsletter.update({
    where: { id },
    data: { published },
  });
  res.json(item);
});

// ----- Admin: delete -----
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;
  await prisma.newsletter.delete({ where: { id } }).catch(() => null);
  res.status(204).send();
});

export default router;
