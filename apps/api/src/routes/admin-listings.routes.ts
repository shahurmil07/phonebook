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

function normalizeKey(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function parseImportStatus(value: unknown): ListingStatus {
  if (!value || typeof value !== "string" || !value.trim()) {
    return ListingStatus.APPROVED;
  }
  const normalized = value.trim().toUpperCase();
  if (normalized === "PENDING" || normalized === "APPROVED" || normalized === "REJECTED") {
    return normalized as ListingStatus;
  }
  throw new AppError(400, `Invalid status "${value}"`);
}

adminListingsRouter.post("/import", async (request, response, next) => {
  try {
    const rows = Array.isArray(request.body?.rows) ? request.body.rows : null;
    if (!rows || rows.length === 0) {
      throw new AppError(400, "CSV has no data rows");
    }
    if (rows.length > 500) {
      throw new AppError(400, "Import limit is 500 rows at a time");
    }

    const [cities, natures, categories] = await Promise.all([
      prisma.city.findMany(),
      prisma.nature.findMany(),
      prisma.category.findMany(),
    ]);

    const cityByKey = new Map(cities.flatMap((item) => [[normalizeKey(item.id), item.id], [normalizeKey(item.name), item.id]]));
    const natureByKey = new Map(
      natures.flatMap((item) => [[normalizeKey(item.id), item.id], [normalizeKey(item.name), item.id]]),
    );
    const categoryByKey = new Map(
      categories.flatMap((item) => [[normalizeKey(item.id), item.id], [normalizeKey(item.name), item.id]]),
    );

    const created: string[] = [];
    const errors: Array<{ row: number; message: string }> = [];

    for (let index = 0; index < rows.length; index += 1) {
      const row = rows[index] as Record<string, unknown>;
      const rowNumber = index + 2;

      try {
        const name = requireString(row.name ?? row.Name, "Name");
        const phone = requireString(row.phone ?? row.Phone, "Phone");
        validatePhone(phone);
        const email = optionalString(row.email ?? row.Email, "Email");
        validateEmail(email);
        const company = optionalString(row.company ?? row.Company, "Company");
        const service = requireString(row.service ?? row.Service, "Service");
        const cityRaw = requireString(row.city ?? row.City ?? row.cityId ?? row.CityId, "City");
        const natureRaw = requireString(
          row.nature ?? row.Nature ?? row.natureId ?? row.NatureId,
          "Nature",
        );
        const categoryRaw = requireString(
          row.category ?? row.Category ?? row.categoryId ?? row.CategoryId,
          "Category",
        );

        const cityId = cityByKey.get(normalizeKey(cityRaw));
        const natureId = natureByKey.get(normalizeKey(natureRaw));
        const categoryId = categoryByKey.get(normalizeKey(categoryRaw));

        if (!cityId) {
          throw new AppError(400, `Unknown city "${cityRaw}"`);
        }
        if (!natureId) {
          throw new AppError(400, `Unknown nature "${natureRaw}"`);
        }
        if (!categoryId) {
          throw new AppError(400, `Unknown category "${categoryRaw}"`);
        }

        const status = parseImportStatus(row.status ?? row.Status);
        const listing = await prisma.listing.create({
          data: {
            name,
            phone,
            email,
            company,
            service,
            cityId,
            natureId,
            categoryId,
            status,
          },
        });
        created.push(listing.id);
      } catch (error) {
        const message = error instanceof AppError ? error.message : "Failed to import row";
        errors.push({ row: rowNumber, message });
      }
    }

    response.json({
      imported: created.length,
      failed: errors.length,
      errors: errors.slice(0, 20),
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
