export type ListingStatus = "pending" | "approved" | "rejected";
export type ListingTag = "active" | "follow-up" | "urgent";
export type ContactTab = "all" | "important";
export type SortKey = "name" | "city";

export type City = {
  id: string;
  name: string;
};

export type NatureOfBusiness = {
  id: string;
  name: string;
};

export type Category = {
  id: string;
  name: string;
};

export type Banner = {
  id: string;
  title: string;
  subtitle: string;
  from: string;
  to: string;
  categoryIds: string[];
};

export type Listing = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  photo?: string;
  cityId: string;
  natureId: string;
  categoryId: string;
  service: string;
  status: ListingStatus;
  important: boolean;
  tags: ListingTag[];
};

export type Reminder = {
  id: string;
  listingId: string;
  title: string;
  when: string;
};
