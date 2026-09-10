import { ListingStatus, type Prisma } from "@prisma/client";
import { Router } from "express";
import { AppError } from "../errors/app-error.js";
import { prisma } from "../lib/prisma.js";
import { requireAdmin } from "../middleware/auth.js";
import { optionalString, requireString, validateEmail, validatePhone } from "../utils/validate.js";

export const adminListingsRouter = Router();

adminListingsRouter.use(requireAdmin);

const listingInclude = {
  city: true,
  nature: true,
  category: true,
} satisfies Prisma.ListingInclude;

function mapListing(listing: Prisma.ListingGetPayload<{ include: typeof listingInclude }>) {
  return {
    id: listing.id,
    name: listing.name,
    phone: listing.phone,
    email: listing.email,
    company: listing.company,
    photo: listing.photo,
    service: listing.service,
    status: listing.status.toLowerCase() as "pending" | "approved" | "rejected",
    important: listing.important,
    cityId: listing.cityId,
    natureId: listing.natureId,
    categoryId: listing.categoryId,
    city: listing.city.name,
    nature: listing.nature.name,
    category: listing.category.name,
    createdAt: listing.createdAt.toISOString(),
    updatedAt: listing.updatedAt.toISOString(),
  };
}

function parseStatus(value: unknown): ListingStatus | undefined {
  if (!value || typeof value !== "string" || value === "all") {
    return undefined;
  }

  const normalized = value.toUpperCase();
  if (normalized === "PENDING" || normalized === "APPROVED" || normalized === "REJECTED") {
    return normalized as ListingStatus;
  }

  throw new AppError(400, "Invalid status filter");
}

adminListingsRouter.get("/", async (request, response, next) => {
  try {
    const limit = Math.min(Number(request.query.limit ?? 8) || 8, 30);
    const cursor = typeof request.query.cursor === "string" ? request.query.cursor : undefined;
    const search = typeof request.query.search === "string" ? request.query.search.trim() : "";
    const status = parseStatus(request.query.status);

    const where: Prisma.ListingWhereInput = {
      ...(status ? { status } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search } },
              { company: { contains: search } },
              { phone: { contains: search } },
              { service: { contains: search } },
            ],
          }
        : {}),
    };

    const rows = await prisma.listing.findMany({
      where,
      include: listingInclude,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: limit + 1,
      ...(cursor
        ? {
            cursor: { id: cursor },
            skip: 1,
          }
        : {}),
    });

    const hasMore = rows.length > limit;
    const items = hasMore ? rows.slice(0, limit) : rows;
    const nextCursor = hasMore ? items[items.length - 1]?.id : null;

    response.json({
      items: items.map(mapListing),
      nextCursor,
      hasMore,
    });
  } catch (error) {
    next(error);
  }
});

adminListingsRouter.patch("/:id/status", async (request, response, next) => {
  try {
    const status = parseStatus(request.body?.status);
    if (!status) {
      throw new AppError(400, "Status is required");
    }

    const listing = await prisma.listing.update({
      where: { id: request.params.id },
      data: { status },
      include: listingInclude,
    });

    response.json(mapListing(listing));
  } catch (error) {
    next(error);
  }
});

adminListingsRouter.patch("/:id", async (request, response, next) => {
  try {
    const name = requireString(request.body?.name, "Name");
    const phone = requireString(request.body?.phone, "Phone");
    validatePhone(phone);
    const email = optionalString(request.body?.email, "Email");
    validateEmail(email);
    const company = optionalString(request.body?.company, "Company");
    const service = requireString(request.body?.service, "Service");
    const cityId = requireString(request.body?.cityId, "City");
    const natureId = requireString(request.body?.natureId, "Nature");
    const categoryId = requireString(request.body?.categoryId, "Category");

    const listing = await prisma.listing.update({
      where: { id: request.params.id },
      data: {
        name,
        phone,
        email,
        company,
        service,
        cityId,
        natureId,
        categoryId,
      },
      include: listingInclude,
    });

    response.json(mapListing(listing));
  } catch (error) {
    next(error);
  }
});

adminListingsRouter.delete("/:id", async (request, response, next) => {
  try {
    await prisma.listing.delete({ where: { id: request.params.id } });
    response.status(204).send();
  } catch (error) {
    next(error);
  }
});
