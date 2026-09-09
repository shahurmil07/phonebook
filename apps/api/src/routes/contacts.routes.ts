import { Router } from "express";
import * as contactsController from "../controllers/contacts.controller.js";

export const contactsRouter: Router = Router();

contactsRouter.get("/", contactsController.list);
contactsRouter.get("/:id", contactsController.getById);
contactsRouter.post("/", contactsController.create);
contactsRouter.put("/:id", contactsController.update);
contactsRouter.delete("/:id", contactsController.remove);
