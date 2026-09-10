import { unlink } from "node:fs/promises";
import path from "node:path";
import { Router } from "express";
import { AppError } from "../errors/app-error.js";
import { prisma } from "../lib/prisma.js";
import { bannerUpload, uploadsRoot } from "../lib/upload.js";
import { requireAdmin } from "../middleware/auth.js";

export const adminBannersRouter = Router();
export const publicBannersRouter = Router();

function mapBanner(banner: {
  id: string;
  imageUrl: string;
  createdAt: Date;
  categories: Array<{ categoryId: string; category: { id: string; name: string } }>;
  cities: Array<{ cityId: string; city: { id: string; name: string } }>;
}) {
  return {
    id: banner.id,
    imageUrl: banner.imageUrl,
    categoryIds: banner.categories.map((item) => item.categoryId),
    cityIds: banner.cities.map((item) => item.cityId),
    categories: banner.categories.map((item) => ({
      id: item.category.id,
      name: item.category.name,
    })),
    cities: banner.cities.map((item) => ({
      id: item.city.id,
      name: item.city.name,
    })),
    createdAt: banner.createdAt.toISOString(),
  };
}

const bannerInclude = {
  categories: { include: { category: true } },
  cities: { include: { city: true } },
} as const;

function parseIdList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((id): id is string => typeof id === "string" && id.length > 0);
  }
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value) as unknown;
      if (Array.isArray(parsed)) {
        return parsed.filter((id): id is string => typeof id === "string" && id.length > 0);
      }
    } catch {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }
  return [];
}

async function removeImageFile(imageUrl: string) {
  if (!imageUrl.startsWith("/uploads/")) {
    return;
  }
  const absolute = path.join(uploadsRoot, imageUrl.replace(/^\/uploads\//, ""));
  try {
    await unlink(absolute);
  } catch {
    // ignore missing files
  }
}

publicBannersRouter.get("/", async (_request, response, next) => {
  try {
    const banners = await prisma.banner.findMany({
      include: bannerInclude,
      orderBy: { createdAt: "desc" },
    });
    response.json(banners.map(mapBanner));
  } catch (error) {
    next(error);
  }
});

adminBannersRouter.use(requireAdmin);

adminBannersRouter.get("/", async (_request, response, next) => {
  try {
    const banners = await prisma.banner.findMany({
      include: bannerInclude,
      orderBy: { createdAt: "desc" },
    });
    response.json(banners.map(mapBanner));
  } catch (error) {
    next(error);
  }
});

adminBannersRouter.post("/", bannerUpload.single("image"), async (request, response, next) => {
  try {
    if (!request.file) {
      throw new AppError(400, "Banner image is required");
    }

    const categoryIds = parseIdList(request.body?.categoryIds);
    const cityIds = parseIdList(request.body?.cityIds);

    if (categoryIds.length > 0) {
      const count = await prisma.category.count({ where: { id: { in: categoryIds } } });
      if (count !== categoryIds.length) {
        throw new AppError(400, "One or more categories are invalid");
      }
    }

    if (cityIds.length > 0) {
      const count = await prisma.city.count({ where: { id: { in: cityIds } } });
      if (count !== cityIds.length) {
        throw new AppError(400, "One or more cities are invalid");
      }
    }

    const imageUrl = `/uploads/banners/${request.file.filename}`;

    const banner = await prisma.banner.create({
      data: {
        imageUrl,
        categories: {
          create: categoryIds.map((categoryId) => ({ categoryId })),
        },
        cities: {
          create: cityIds.map((cityId) => ({ cityId })),
        },
      },
      include: bannerInclude,
    });

    response.status(201).json(mapBanner(banner));
  } catch (error) {
    if (request.file) {
      await removeImageFile(`/uploads/banners/${request.file.filename}`);
    }
    next(error);
  }
});

adminBannersRouter.delete("/:id", async (request, response, next) => {
  try {
    const banner = await prisma.banner.findUnique({ where: { id: request.params.id } });
    if (!banner) {
      throw new AppError(404, "Banner not found");
    }

    await prisma.banner.delete({ where: { id: banner.id } });
    await removeImageFile(banner.imageUrl);
    response.status(204).send();
  } catch (error) {
    next(error);
  }
});
