export type DashboardStat = {
  label: string;
  value: string | number;
  change?: string;
};

export type DashboardUser = {
  id: string;
  name: string;
  email: string;
  role: "buyer" | "seller" | "broker" | "admin";
};
