import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth, requireAdmin, AuthRequest } from "../middleware/auth.js";

const router = Router();
const prisma = new PrismaClient();

const DEFAULTS: Record<string, string> = {
  about_hero: "Empowering Women Through Education, Skills, And Opportunity.",
  about_swrc_text:
    "Founded in 2021, The Somaliland Women Resource Centre (SWRC) is a women-led initiative dedicated to bridging the gap between education and meaningful employment. We provide a safe, inclusive space for young women and girls to gain the practical skills, mentorship, and confidence needed to become leaders and change-makers in their communities.",
  about_vision:
    "A Somaliland where every woman and girl is empowered to reach her full potential in a safe, equitable society, with equal access to education, employment, and leadership.",
  about_mission:
    "To empower young women and girls through education, mentorship, and skills development, providing pathways to dignified employment and leadership while fostering community resilience and gender equality.",
  footer_mission:
    "Equipping women to achieve purpose, fulfillment, and financial stability through meaningful employment and empowerment programs in Somaliland.",
  footer_address: "Hargeisa, Somaliland\nMain Office, Road 1",
  footer_phone: "+252 (0) 63 XXXXXXX",
  footer_email: "info@swrc.org",
};

// ----- Public: get all settings -----
router.get("/", async (_req, res) => {
  const rows = await prisma.siteSetting.findMany();
  const obj: Record<string, string> = { ...DEFAULTS };
  for (const r of rows) {
    obj[r.key] = r.value;
  }
  res.json(obj);
});

// ----- Admin: get all (same as public) -----
router.get("/admin", requireAuth, requireAdmin, async (_req, res) => {
  const rows = await prisma.siteSetting.findMany();
  const obj: Record<string, string> = { ...DEFAULTS };
  for (const r of rows) {
    obj[r.key] = r.value;
  }
  res.json(obj);
});

// ----- Admin: update settings -----
router.put("/", requireAuth, requireAdmin, async (req: AuthRequest, res) => {
  const body = req.body as Record<string, string>;
  const keys = Object.keys(DEFAULTS);
  for (const key of keys) {
    if (typeof body[key] === "string") {
      await prisma.siteSetting.upsert({
        where: { key },
        create: { key, value: body[key] },
        update: { value: body[key] },
      });
    }
  }
  const rows = await prisma.siteSetting.findMany();
  const obj: Record<string, string> = { ...DEFAULTS };
  for (const r of rows) {
    obj[r.key] = r.value;
  }
  res.json(obj);
});

export default router;
