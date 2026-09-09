import type { NextFunction, Request, Response } from "express";
import * as contactsService from "../services/contacts.service.js";

export function list(_request: Request, response: Response, next: NextFunction): void {
  try {
    response.json(contactsService.listContacts());
  } catch (error) {
    next(error);
  }
}

export function getById(request: Request, response: Response, next: NextFunction): void {
  try {
    const contact = contactsService.getContact(requireId(request));
    response.json(contact);
  } catch (error) {
    next(error);
  }
}

export function create(request: Request, response: Response, next: NextFunction): void {
  try {
    const contact = contactsService.createContact(request.body);
    response.status(201).json(contact);
  } catch (error) {
    next(error);
  }
}

export function update(request: Request, response: Response, next: NextFunction): void {
  try {
    const contact = contactsService.updateContact(requireId(request), request.body);
    response.json(contact);
  } catch (error) {
    next(error);
  }
}

export function remove(request: Request, response: Response, next: NextFunction): void {
  try {
    contactsService.deleteContact(requireId(request));
    response.status(204).send();
  } catch (error) {
    next(error);
  }
}

function requireId(request: Request): string {
  const { id } = request.params;

  if (!id) {
    throw new Error("Contact id is missing from the route");
  }

  return id;
}
