import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth, requireAdmin, AuthRequest } from "../middleware/auth.js";

const router = Router();
const prisma = new PrismaClient();

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

router.post("/", requireAuth, requireAdmin, async (req: AuthRequest, res) => {
  const body = req.body as Record<string, string>;
  const title = body.title?.trim();
  const description = body.description?.trim() ?? "";
  const iconName = body.iconName?.trim() || null;
  const sortOrder = parseInt(body.sortOrder, 10) || 0;

  if (!title) {
    res.status(400).json({ error: "Title is required" });
    return;
  }

  const slug = slugify(title) + "-" + Date.now().toString(36);
  const item = await prisma.program.create({
    data: { title, slug, description, iconName, sortOrder },
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

router.put("/:id", requireAuth, requireAdmin, async (req: AuthRequest, res) => {
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

  const item = await prisma.program.update({
    where: { id },
    data: { title, description, iconName, sortOrder },
  });
  res.json(item);
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;
  await prisma.program.delete({ where: { id } }).catch(() => null);
  res.status(204).send();
});

export default router;
