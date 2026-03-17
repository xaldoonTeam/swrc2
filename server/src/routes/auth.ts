import { Router } from "express";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { createAccessToken, createRefreshToken, requireAuth, AuthRequest } from "../middleware/auth.js";

const router = Router();
const prisma = new PrismaClient();

router.post("/login", async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    res.status(400).json({ error: "Email and password required" });
    return;
  }

  const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
  if (!user) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const userData = { id: user.id, email: user.email, role: user.role };
  const isProd = process.env.NODE_ENV === "production";
  const accessToken = createAccessToken(userData);
  const refreshToken = createRefreshToken(userData);

  const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshTokenHash },
  });

  res.cookie("swrc_token", accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
  res.cookie("swrc_refresh", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  res.cookie("swrc_user", JSON.stringify(userData), {
    httpOnly: false,
    secure: isProd,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ user: userData });
});

router.post("/logout", async (req, res) => {
  const cookies = (req as typeof req & { cookies?: { swrc_refresh?: string } }).cookies;
  const refreshToken = cookies?.swrc_refresh;

  if (refreshToken) {
    const user = await prisma.user.findFirst({
      where: { refreshTokenHash: { not: null } },
    });
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { refreshTokenHash: null },
      });
    }
  }

  res.clearCookie("swrc_token");
  res.clearCookie("swrc_refresh");
  res.clearCookie("swrc_user");
  res.status(204).send();
});

router.post("/refresh", async (req, res) => {
  const cookies = (req as typeof req & { cookies?: { swrc_refresh?: string } }).cookies;
  const token = cookies?.swrc_refresh;
  if (!token) {
    res.status(401).json({ error: "Refresh token missing" });
    return;
  }

  const isProd = process.env.NODE_ENV === "production";

  try {
    const decoded = (await import("jsonwebtoken")).default.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET ?? process.env.JWT_SECRET ?? "dev-refresh-secret-change-in-production"
    ) as { userId: string; email: string; role: string };

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user || !user.refreshTokenHash) {
      res.status(401).json({ error: "Invalid refresh token" });
      return;
    }

    const matches = await bcrypt.compare(token, user.refreshTokenHash);
    if (!matches) {
      res.status(401).json({ error: "Invalid refresh token" });
      return;
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    const newAccessToken = createAccessToken(payload);
    const newRefreshToken = createRefreshToken(payload);
    const newHash = await bcrypt.hash(newRefreshToken, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshTokenHash: newHash },
    });

    res.cookie("swrc_token", newAccessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("swrc_refresh", newRefreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ ok: true });
  } catch {
    res.status(401).json({ error: "Invalid or expired refresh token" });
  }
});

router.get("/me", requireAuth, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: { id: true, email: true, role: true },
  });
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json(user);
});

router.put("/profile", requireAuth, async (req: AuthRequest, res) => {
  const { email, currentPassword, newPassword } = req.body as {
    email?: string;
    currentPassword?: string;
    newPassword?: string;
  };

  const userId = req.user!.userId;
  const existing = await prisma.user.findUnique({ where: { id: userId } });
  if (!existing) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  // Verify current password if changing credentials
  if (email && email.trim().toLowerCase() !== existing.email) {
    if (!currentPassword) {
      res.status(400).json({ error: "Current password required to change email" });
      return;
    }
    const valid = await bcrypt.compare(currentPassword, existing.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Invalid current password" });
      return;
    }
  }

  if (newPassword) {
    if (!currentPassword) {
      res.status(400).json({ error: "Current password required to change password" });
      return;
    }
    const valid = await bcrypt.compare(currentPassword, existing.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Invalid current password" });
      return;
    }
    if (newPassword.length < 8) {
      res.status(400).json({ error: "New password must be at least 8 characters" });
      return;
    }
  }

  const update: { email?: string; passwordHash?: string } = {};
  if (email && email.trim()) {
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
  if (newPassword) {
    update.passwordHash = await bcrypt.hash(newPassword, 10);
  }

  if (Object.keys(update).length === 0) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true },
    });
    return res.json(user);
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: update,
    select: { id: true, email: true, role: true },
  });

  const userData = { id: user.id, email: user.email, role: user.role };
  const isProd = process.env.NODE_ENV === "production";
  const maxAge = 7 * 24 * 60 * 60;
  res.cookie("swrc_user", JSON.stringify(userData), {
    httpOnly: false,
    secure: isProd,
    sameSite: "lax",
    maxAge: maxAge * 1000,
  });

  res.json(user);
});

export default router;
