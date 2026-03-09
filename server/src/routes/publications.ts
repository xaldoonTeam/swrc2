import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth, requireAdmin, AuthRequest } from "../middleware/auth.js";
import { uploadPdf, getFileUrl } from "../utils/upload.js";

const router = Router();
const prisma = new PrismaClient();

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

// ----- Public: list published -----
router.get("/", async (_req, res) => {
  const list = await prisma.publication.findMany({
    where: { published: true },
    orderBy: [{ year: "desc" }, { createdAt: "desc" }],
  });
  res.json(list);
});

// ----- Admin: list all (including unpublished) -----
router.get("/admin/list", requireAuth, requireAdmin, async (_req, res) => {
  const list = await prisma.publication.findMany({
    orderBy: [{ year: "desc" }, { createdAt: "desc" }],
  });
  res.json(list);
});

// ----- Admin: create -----
router.post("/", requireAuth, requireAdmin, uploadPdf.single("file"), async (req: AuthRequest, res) => {
  const body = req.body as Record<string, string>;
  const title = body.title?.trim();
  const type = body.type?.trim() || "Report";
  const description = body.description?.trim() || "";
  const year = parseInt(body.year, 10) || new Date().getFullYear();
  const pages = body.pages ? parseInt(body.pages, 10) : undefined;
  const fileSize = body.fileSize?.trim() || null;
  const published = body.published !== "false";

  if (!title) {
    res.status(400).json({ error: "Title is required" });
    return;
  }

  const slug = slugify(title) + "-" + Date.now().toString(36);
  let fileUrl: string | null = null;
  if (req.file?.filename) {
    fileUrl = getFileUrl(req.file.filename, "pdfs");
  }

  const pub = await prisma.publication.create({
    data: {
      title,
      slug,
      type,
      description,
      year,
      pages: pages ?? null,
      fileSize,
      fileUrl,
      published,
    },
  });
  res.status(201).json(pub);
});

// ----- Public: get one by id or slug -----
router.get("/:idOrSlug", async (req, res) => {
  const { idOrSlug } = req.params;
  const isCuid = idOrSlug.length === 25 && !idOrSlug.includes("-");
  const item = await prisma.publication.findFirst({
    where: isCuid ? { id: idOrSlug } : { slug: idOrSlug },
  });
  if (!item) {
    res.status(404).json({ error: "Publication not found" });
    return;
  }
  if (!item.published) {
    res.status(404).json({ error: "Publication not found" });
    return;
  }
  res.json(item);
});

// ----- Admin: update -----
router.put("/:id", requireAuth, requireAdmin, uploadPdf.single("file"), async (req: AuthRequest, res) => {
  const { id } = req.params;
  const body = req.body as Record<string, string>;
  const existing = await prisma.publication.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ error: "Publication not found" });
    return;
  }

  const title = body.title?.trim() ?? existing.title;
  const type = body.type?.trim() ?? existing.type;
  const description = body.description?.trim() ?? existing.description;
  const year = parseInt(body.year, 10) || existing.year;
  const pages = body.pages ? parseInt(body.pages, 10) : existing.pages;
  const fileSize = body.fileSize?.trim() ?? existing.fileSize;
  const published = body.published !== "false";

  let fileUrl = existing.fileUrl;
  if (req.file?.filename) {
    fileUrl = getFileUrl(req.file.filename, "pdfs");
  }

  const pub = await prisma.publication.update({
    where: { id },
    data: { title, type, description, year, pages: pages ?? null, fileSize, fileUrl, published },
  });
  res.json(pub);
});

// ----- Admin: update published only -----
router.patch("/:id", requireAuth, requireAdmin, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const body = req.body as { published?: boolean };
  const existing = await prisma.publication.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ error: "Publication not found" });
    return;
  }
  const published = body.published === true;
  const pub = await prisma.publication.update({
    where: { id },
    data: { published },
  });
  res.json(pub);
});

// ----- Admin: delete -----
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;
  await prisma.publication.delete({ where: { id } }).catch(() => null);
  res.status(204).send();
});

export default router;
