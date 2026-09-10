import { Router } from "express";
import { AppError } from "../errors/app-error.js";
import { prisma } from "../lib/prisma.js";
import { requireAdmin } from "../middleware/auth.js";
import { requireString } from "../utils/validate.js";

export const adminCategoriesRouter = Router();

adminCategoriesRouter.use(requireAdmin);

adminCategoriesRouter.get("/", async (_request, response, next) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { listings: true } } },
    });

    response.json(
      categories.map((category) => ({
        id: category.id,
        name: category.name,
        listingsCount: category._count.listings,
        createdAt: category.createdAt.toISOString(),
      })),
    );
  } catch (error) {
    next(error);
  }
});

adminCategoriesRouter.post("/", async (request, response, next) => {
  try {
    const name = requireString(request.body?.name, "Name");
    const existing = await prisma.category.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
    });
    if (existing) {
      throw new AppError(409, "Category already exists");
    }

    const category = await prisma.category.create({ data: { name } });
    response.status(201).json({
      id: category.id,
      name: category.name,
      listingsCount: 0,
      createdAt: category.createdAt.toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

adminCategoriesRouter.delete("/:id", async (request, response, next) => {
  try {
    const count = await prisma.listing.count({ where: { categoryId: request.params.id } });
    if (count > 0) {
      throw new AppError(400, "Cannot delete category with listings");
    }

    await prisma.category.delete({ where: { id: request.params.id } });
    response.status(204).send();
  } catch (error) {
    next(error);
  }
});
