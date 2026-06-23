import type { ReactNode } from "react";
import {
  AuctionsIcon,
  BrokersIcon,
  BuyersIcon,
  OverviewIcon,
  PropertiesIcon,
  SellersIcon,
  SystemMasterIcon,
  UsersIcon,
} from "@/dashboard/icons/nav-icons";

export type UserRole =
  | "Buyer"
  | "Seller"
  | "Broker"
  | "Admin"
  | "Super-Admin";

export type DashboardNavItem = {
  id: string;
  label: string;
  href?: string;
  icon?: ReactNode;
  badge?: string;
  description?: string;
  external?: boolean;
  disabled?: boolean;
  roles?: UserRole[];
  defaultOpen?: boolean;
  children?: DashboardNavItem[];
};

export const dashboardNavItems: DashboardNavItem[] = [
  {
    id: "overview",
    label: "Overview",
    href: "/dashboard",
    icon: <OverviewIcon />,
  },
  {
    id: "auctions",
    label: "Live Auctions",
    href: "/dashboard/auctions",
    icon: <AuctionsIcon />,
    description: "Browse and bid on live property auctions",
  },
  {
    id: "properties",
    label: "Properties",
    href: "/dashboard/property",
    icon: <PropertiesIcon />,
    roles: ["Seller", "Broker", "Admin", "Super-Admin"],
    description: "Manage your property listings",
  },
  {
    id: "buyers",
    label: "My Bids",
    href: "/dashboard/buyers",
    icon: <BuyersIcon />,
    roles: ["Buyer", "Broker"],
    description: "View properties you have bid on",
  },
  {
    id: "sellers",
    label: "Sellers",
    href: "/dashboard/sellers",
    roles: ["Seller"],
    icon: <SellersIcon />,
  },
  {
    id: "brokers",
    label: "Brokers",
    href: "/dashboard/brokers",
    icon: <BrokersIcon />,
  },
  {
    id: "system-master",
    label: "System Master",
    icon: <SystemMasterIcon />,
    roles: ["Super-Admin"],
    children: [
      {
        id: "system-master-users",
        label: "Users",
        href: "/dashboard/system-master/users",
        icon: <UsersIcon />,
        roles: ["Super-Admin"],
      },
    ],
  },
];

export const ALL_USER_ROLES: UserRole[] = [
  "Buyer",
  "Seller",
  "Broker",
  "Admin",
  "Super-Admin",
];
