export type SiteNavItem = {
  href: string;
  label: string;
};

export const siteNavItems: SiteNavItem[] = [
  { href: "/", label: "Home" },
  { href: "/auctions", label: "Auctions" },
  { href: "/properties", label: "Properties" },
  { href: "/buyers", label: "Buyers" },
  { href: "/sellers", label: "Sellers" },
  { href: "/brokers", label: "Brokers" },
];
