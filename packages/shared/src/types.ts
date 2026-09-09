export type Contact = {
  id: string;
  name: string;
  phone: string;
  email?: string;
};

export type CreateContactInput = {
  name: string;
  phone: string;
  email?: string;
};

export type UpdateContactInput = {
  name?: string;
  phone?: string;
  email?: string;
};
