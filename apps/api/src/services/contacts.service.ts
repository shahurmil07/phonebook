import { randomUUID } from "node:crypto";
import type { Contact, CreateContactInput, UpdateContactInput } from "@phonebook/shared";
import { AppError } from "../errors/app-error.js";
import { optionalString, requireString, validateEmail, validatePhone } from "../utils/validate.js";

const contacts = new Map<string, Contact>([
  [
    "seed-1",
    {
      id: "seed-1",
      name: "Ada Lovelace",
      phone: "+44 20 7946 0958",
      email: "ada@analytical.engine",
    },
  ],
  [
    "seed-2",
    {
      id: "seed-2",
      name: "Grace Hopper",
      phone: "+1 202 555 0147",
      email: "grace@cobol.dev",
    },
  ],
]);

export function listContacts(): Contact[] {
  return [...contacts.values()].sort((left, right) => left.name.localeCompare(right.name));
}

export function getContact(id: string): Contact {
  const contact = contacts.get(id);

  if (!contact) {
    throw new AppError(404, "Contact not found");
  }

  return contact;
}

export function createContact(input: unknown): Contact {
  const payload = parseCreateInput(input);
  const contact: Contact = { id: randomUUID(), ...payload };
  contacts.set(contact.id, contact);
  return contact;
}

export function updateContact(id: string, input: unknown): Contact {
  const existing = getContact(id);
  const payload = parseUpdateInput(input);
  const updated: Contact = {
    ...existing,
    ...payload,
    email: payload.email === undefined ? existing.email : payload.email,
  };

  contacts.set(id, updated);
  return updated;
}

export function deleteContact(id: string): void {
  getContact(id);
  contacts.delete(id);
}

function parseCreateInput(input: unknown): CreateContactInput {
  const body = asObject(input);
  const name = requireString(body.name, "name");
  const phone = requireString(body.phone, "phone");
  const email = optionalString(body.email, "email");

  validatePhone(phone);
  validateEmail(email);

  return { name, phone, email };
}

function parseUpdateInput(input: unknown): UpdateContactInput {
  const body = asObject(input);
  const name = body.name === undefined ? undefined : requireString(body.name, "name");
  const phone = body.phone === undefined ? undefined : requireString(body.phone, "phone");
  const email = optionalString(body.email, "email");

  if (phone) {
    validatePhone(phone);
  }

  validateEmail(email);

  return { name, phone, email };
}

function asObject(input: unknown): Record<string, unknown> {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    throw new AppError(400, "Request body must be an object");
  }

  return input as Record<string, unknown>;
}
