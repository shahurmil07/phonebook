import { Router } from "express";
import { prisma } from "../lib/prisma.js";

export const taxonomyRouter = Router();

taxonomyRouter.get("/cities", async (_request, response, next) => {
  try {
    const cities = await prisma.city.findMany({ orderBy: { name: "asc" } });
    response.json(cities);
  } catch (error) {
    next(error);
  }
});

taxonomyRouter.get("/natures", async (_request, response, next) => {
  try {
    const natures = await prisma.nature.findMany({ orderBy: { name: "asc" } });
    response.json(natures);
  } catch (error) {
    next(error);
  }
});
