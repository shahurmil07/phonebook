import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/app-error.js";
import { requireEnv } from "../lib/env.js";
import { prisma } from "../lib/prisma.js";
import { requireString } from "../utils/validate.js";

export const authRouter = Router();

authRouter.post("/login", async (request, response, next) => {
  try {
    const email = requireString(request.body?.email, "Email").toLowerCase();
    const password = requireString(request.body?.password, "Password");

    const admin = await prisma.adminUser.findUnique({ where: { email } });
    if (!admin) {
      throw new AppError(401, "Invalid email or password");
    }

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) {
      throw new AppError(401, "Invalid email or password");
    }

    const token = jwt.sign({ sub: admin.id, email: admin.email }, requireEnv("JWT_SECRET"), {
      expiresIn: "7d",
    });

    response.json({
      token,
      user: {
        id: admin.id,
        email: admin.email,
      },
    });
  } catch (error) {
    next(error);
  }
});
