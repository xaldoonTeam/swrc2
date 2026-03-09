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

function parseKeywords(v: unknown): string[] {
  if (Array.isArray(v)) return v.filter((x) => typeof x === "string");
  if (typeof v === "string") return v.split(",").map((s) => s.trim()).filter(Boolean);
  return [];
}

// ----- Public: list published -----
router.get("/", async (_req, res) => {
  const list = await prisma.research.findMany({
    where: { published: true },
    orderBy: [{ year: "desc" }, { createdAt: "desc" }],
  });
  res.json(list);
});

// ----- Admin -----
router.get("/admin/list", requireAuth, requireAdmin, async (_req, res) => {
  const list = await prisma.research.findMany({
    orderBy: [{ year: "desc" }, { createdAt: "desc" }],
  });
  res.json(list);
});

router.post("/", requireAuth, requireAdmin, uploadPdf.single("file"), async (req: AuthRequest, res) => {
  const body = req.body as Record<string, unknown>;
  const title = String(body.title ?? "").trim();
  const authors = String(body.authors ?? "").trim();
  const year = Number(body.year) || new Date().getFullYear();
  const abstract = String(body.abstract ?? "").trim();
  const methodology = String(body.methodology ?? "").trim() || null;
  const category = String(body.category ?? "").trim() || "Research";
  const keywords = parseKeywords(body.keywords ?? []);
  const published = body.published !== "false";

  if (!title) {
    res.status(400).json({ error: "Title is required" });
    return;
  }

  const slug = slugify(title) + "-" + Date.now().toString(36);
  let pdfUrl: string | null = null;
  if (req.file?.filename) {
    pdfUrl = getFileUrl(req.file.filename, "pdfs");
  }

  const item = await prisma.research.create({
    data: {
      title,
      slug,
      authors,
      year,
      abstract,
      methodology,
      category,
      keywords,
      pdfUrl,
      published,
    },
  });
  res.status(201).json(item);
});

router.get("/:idOrSlug", async (req, res) => {
  const { idOrSlug } = req.params;
  const isCuid = idOrSlug.length === 25 && !idOrSlug.includes("-");
  const item = await prisma.research.findFirst({
    where: isCuid ? { id: idOrSlug } : { slug: idOrSlug },
  });
  if (!item || !item.published) {
    res.status(404).json({ error: "Research not found" });
    return;
  }
  res.json(item);
});

router.put("/:id", requireAuth, requireAdmin, uploadPdf.single("file"), async (req: AuthRequest, res) => {
  const { id } = req.params;
  const existing = await prisma.research.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ error: "Research not found" });
    return;
  }

  const body = req.body as Record<string, unknown>;
  const title = String(body.title ?? existing.title).trim();
  const authors = String(body.authors ?? existing.authors).trim();
  const year = Number(body.year) ?? existing.year;
  const abstract = String(body.abstract ?? existing.abstract).trim();
  const methodology = String(body.methodology ?? existing.methodology).trim() || null;
  const category = String(body.category ?? existing.category).trim();
  const keywords = parseKeywords(body.keywords ?? existing.keywords);
  const published = body.published !== "false";

  let pdfUrl = existing.pdfUrl;
  if (req.file?.filename) {
    pdfUrl = getFileUrl(req.file.filename, "pdfs");
  }

  const item = await prisma.research.update({
    where: { id },
    data: { title, authors, year, abstract, methodology, category, keywords, pdfUrl, published },
  });
  res.json(item);
});

router.patch("/:id", requireAuth, requireAdmin, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const body = req.body as { published?: boolean };
  const existing = await prisma.research.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ error: "Research not found" });
    return;
  }
  const published = body.published === true;
  const item = await prisma.research.update({
    where: { id },
    data: { published },
  });
  res.json(item);
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;
  await prisma.research.delete({ where: { id } }).catch(() => null);
  res.status(204).send();
});

export default router;
