import { api } from "@/lib/api";
import type { PaginatedResponse } from "@/lib/pagination";

export const TICKET_CATEGORIES = [
  "Billing",
  "Auction",
  "KYC",
  "Technical",
  "General",
] as const;

export const TICKET_PRIORITIES = ["Low", "Medium", "High", "Urgent"] as const;

export const TICKET_STATUSES = [
  "Open",
  "In Progress",
  "Waiting on User",
  "Resolved",
  "Closed",
] as const;

export type TicketCategory = (typeof TICKET_CATEGORIES)[number];
export type TicketPriority = (typeof TICKET_PRIORITIES)[number];
export type TicketStatus = (typeof TICKET_STATUSES)[number];

export type TicketUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  image: string;
};

export type TicketProperty = {
  id: string;
  title: string;
  city: string;
} | null;

export type Ticket = {
  id: string;
  ticketNumber: string;
  subject: string;
  description?: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  replyCount: number;
  userId: TicketUser | null;
  assignedTo: TicketUser | null;
  propertyId: TicketProperty;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
};

export type TicketReply = {
  id: string;
  ticketId: string;
  content: string;
  isInternal: boolean;
  authorId: TicketUser | null;
  createdAt: string;
  updatedAt: string;
};

export type TicketDetail = Ticket & {
  description: string;
  replies: TicketReply[];
};

export type TicketsResponse = PaginatedResponse<Ticket>;

export type TicketResponse = {
  success: boolean;
  message?: string;
  data?: Ticket;
};

export type TicketDetailResponse = {
  success: boolean;
  message?: string;
  data?: TicketDetail;
};

export type TicketReplyResponse = {
  success: boolean;
  message?: string;
  data?: TicketReply;
};

export async function fetchTicketMeta() {
  const { data } = await api.get<{
    success: boolean;
    data: {
      categories: TicketCategory[];
      priorities: TicketPriority[];
      statuses: TicketStatus[];
    };
  }>("/api/tickets/meta");
  return data;
}

export async function createTicket(payload: {
  subject: string;
  description: string;
  category: TicketCategory;
  priority?: TicketPriority;
  propertyId?: string;
}) {
  const { data } = await api.post<TicketResponse>("/api/tickets", payload);
  return data;
}

export async function fetchMyTickets(params?: {
  page?: number;
  status?: TicketStatus;
}) {
  const { data } = await api.get<TicketsResponse>("/api/tickets/mine", {
    params,
  });
  return data;
}

export async function fetchTicketById(id: string) {
  const { data } = await api.get<TicketDetailResponse>(`/api/tickets/${id}`);
  return data;
}

export async function addTicketReply(
  ticketId: string,
  payload: { content: string; isInternal?: boolean },
) {
  const { data } = await api.post<TicketReplyResponse>(
    `/api/tickets/${ticketId}/replies`,
    payload,
  );
  return data;
}

export async function fetchAdminTickets(params?: {
  page?: number;
  search?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  category?: TicketCategory;
}) {
  const { data } = await api.get<TicketsResponse>("/api/tickets/admin/list", {
    params,
  });
  return data;
}

export async function updateAdminTicket(
  id: string,
  payload: {
    status?: TicketStatus;
    priority?: TicketPriority;
    category?: TicketCategory;
    assignedTo?: string | null;
  },
) {
  const { data } = await api.patch<TicketResponse>(
    `/api/tickets/admin/${id}`,
    payload,
  );
  return data;
}

export async function fetchAdminSupportUsers() {
  const { data } = await api.get<{ success: boolean; data: TicketUser[] }>(
    "/api/tickets/admin/users",
  );
  return data;
}

export function statusBadgeClass(status: TicketStatus) {
  switch (status) {
    case "Open":
      return "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300";
    case "In Progress":
      return "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300";
    case "Waiting on User":
      return "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
    case "Resolved":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
    case "Closed":
      return "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300";
    default:
      return "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300";
  }
}

export function priorityBadgeClass(priority: TicketPriority) {
  switch (priority) {
    case "Urgent":
      return "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300";
    case "High":
      return "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300";
    case "Medium":
      return "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
    case "Low":
      return "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300";
    default:
      return "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300";
  }
}

export function categoryBadgeClass(category: TicketCategory) {
  switch (category) {
    case "Billing":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
    case "Auction":
      return "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300";
    case "KYC":
      return "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300";
    case "Technical":
      return "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300";
    default:
      return "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300";
  }
}
