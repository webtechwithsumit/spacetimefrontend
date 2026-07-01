import type { ReactNode } from "react";
import {
  AnalyticsIcon,
  AuctionsIcon,
  BidMonitorIcon,
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
    id: "analytics",
    label: "Analytics",
    icon: <AnalyticsIcon />,
    roles: ["Admin", "Super-Admin"],
    description: "Platform metrics and user activity",
    children: [
      {
        id: "analytics-overview",
        label: "Overview",
        href: "/dashboard/analytics",
        icon: <AnalyticsIcon />,
        roles: ["Admin", "Super-Admin"],
      },
      {
        id: "analytics-user-activity",
        label: "User Activity",
        href: "/dashboard/analytics/user-activity",
        icon: <UsersIcon />,
        roles: ["Admin", "Super-Admin"],
        description: "Clicks, page visits, and user journeys",
      },
    ],
  },
  {
    id: "blog",
    label: "Blog",
    href: "/dashboard/blog",
    icon: <OverviewIcon />,
    roles: ["Admin", "Super-Admin"],
    description: "Create and publish site articles",
  },
  {
    id: "community",
    label: "Community",
    href: "/dashboard/community",
    icon: <UsersIcon />,
    roles: ["Admin", "Super-Admin"],
    description: "Moderate community discussions",
  },
  {
    id: "support",
    label: "Support",
    href: "/dashboard/support",
    icon: <UsersIcon />,
    roles: ["Admin", "Super-Admin"],
    description: "Manage user support tickets",
  },
  {
    id: "auctions",
    label: "Live Auctions",
    href: "/dashboard/auctions",
    icon: <AuctionsIcon />,
    description: "Browse and bid on live property auctions",
  },
  {
    id: "bid-monitor",
    label: "Bid Monitor",
    href: "/dashboard/bid-monitor",
    icon: <BidMonitorIcon />,
    roles: ["Seller", "Broker", "Admin", "Super-Admin"],
    description: "View live bidding activity and leading bidders",
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
      {
        id: "system-master-analytics-subscriptions",
        label: "Seller Analytics",
        href: "/dashboard/system-master/analytics-subscriptions",
        icon: <AnalyticsIcon />,
        roles: ["Super-Admin"],
        description: "Enable paid property analytics for sellers and brokers",
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
