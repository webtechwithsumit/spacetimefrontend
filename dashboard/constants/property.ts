export const PROPERTY_CATEGORIES = [
  "Independent Building (Commercial office)",
  "Office Space",
  "Retail Shop",
  "Warehouse",
  "Residential Apartment",
  "Independent House / Villa",
  "Plot / Land",
  "Industrial",
  "Residential",
  "Commercial",
  "Land",
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

export const PROPERTY_APPROVALS = [
  "Building Plan Sanctioned",
  "Occupancy Certificate",
  "Environmental Clearance",
  "RERA Registered",
  "Fire NOC",
  "Municipal Approval",
  "Water Connection",
  "Electricity Connection",
] as const;

export const PROPERTY_DOCUMENT_ACCEPT =
  "image/*,application/pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Puducherry",
  "Chandigarh",
] as const;

export const CONSTRUCTION_STATUSES = [
  "Ready to Move",
  "Under Construction",
  "New Launch",
] as const;

export const FURNISHING_STATUSES = [
  "Fully Furnished",
  "Semi Furnished",
  "Unfurnished",
  "Others",
] as const;

export const CAR_PARKING_INCLUDED = ["Yes", "No"] as const;

export const PARKING_TYPES = [
  "Podium",
  "Basement",
  "Open",
  "Stack",
  "Mechanical",
] as const;

export const PLOT_AREA_UNITS = ["Sq. Yards", "Sq. Meters", "Sq. Ft."] as const;
