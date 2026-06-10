export const PROPERTY_CATEGORIES = [
  "Residential",
  "Commercial",
  "Land",
  "Industrial",
  "Retail",
] as const;

export const PROPERTY_STATUSES = [
  "Draft",
  "Listed",
  "Under Auction",
  "Sold",
  "Withdrawn",
] as const;

export type PropertyCategory = (typeof PROPERTY_CATEGORIES)[number];
export type PropertyStatus = (typeof PROPERTY_STATUSES)[number];

export const PROPERTY_MANAGER_ROLES = ["Seller", "Admin", "Super-Admin"];
