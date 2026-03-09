import { Router } from "express";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { requireAuth, requireRoleAdmin, AuthRequest } from "../middleware/auth.js";

const router = Router();
const prisma = new PrismaClient();

// All routes require auth + ADMIN role
router.use(requireAuth, requireRoleAdmin);

router.get("/", async (_req, res) => {
  const list = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, email: true, role: true, createdAt: true },
  });
  res.json(list);
});

router.post("/", async (req: AuthRequest, res) => {
  const { email, password, role } = req.body as { email?: string; password?: string; role?: string };
  const trimmed = email?.trim().toLowerCase();
  if (!trimmed) {
    res.status(400).json({ error: "Email is required" });
    return;
  }
  if (!password || password.length < 8) {
    res.status(400).json({ error: "Password must be at least 8 characters" });
    return;
  }
  const validRole = role === "ADMIN" || role === "EDITOR" ? role : "EDITOR";

  const taken = await prisma.user.findUnique({ where: { email: trimmed } });
  if (taken) {
    res.status(400).json({ error: "Email already in use" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email: trimmed, passwordHash, role: validRole },
    select: { id: true, email: true, role: true, createdAt: true },
  });
  res.status(201).json(user);
});

router.put("/:id", async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { email, password, role } = req.body as { email?: string; password?: string; role?: string };
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const update: { email?: string; passwordHash?: string; role?: "ADMIN" | "EDITOR" } = {};
  if (typeof email === "string" && email.trim()) {
    const trimmed = email.trim().toLowerCase();
    if (trimmed !== existing.email) {
      const taken = await prisma.user.findUnique({ where: { email: trimmed } });
      if (taken) {
        res.status(400).json({ error: "Email already in use" });
        return;
      }
      update.email = trimmed;
    }
  }
  if (password && password.length >= 8) {
    update.passwordHash = await bcrypt.hash(password, 10);
  }
  if (role === "ADMIN" || role === "EDITOR") {
    update.role = role;
  }

  const user = await prisma.user.update({
    where: { id },
    data: update,
    select: { id: true, email: true, role: true, createdAt: true },
  });
  res.json(user);
});

router.delete("/:id", async (req: AuthRequest, res) => {
  const { id } = req.params;
  const currentUserId = req.user!.userId;
  if (id === currentUserId) {
    res.status(400).json({ error: "Cannot delete your own account" });
    return;
  }
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  await prisma.user.delete({ where: { id } });
  res.status(204).send();
});

export default router;
