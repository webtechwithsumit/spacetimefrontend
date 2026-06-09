export type DashboardNavItem = {
  href: string;
  label: string;
  icon?: string;
};

export const dashboardNavItems: DashboardNavItem[] = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/auctions", label: "Auctions" },
  { href: "/dashboard/properties", label: "Properties" },
  { href: "/dashboard/buyers", label: "Buyers" },
  { href: "/dashboard/sellers", label: "Sellers" },
  { href: "/dashboard/brokers", label: "Brokers" },
];
