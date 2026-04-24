const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AdminStats {
  totalUsers: number;
  totalGenerations: number;
  activeUsersLast7d: number;
  planBreakdown: {
    free: number;
    starter: number;
    pro: number;
  };
  avgRating: number;
  totalFeedback: number;
}

export interface AdminUser {
  id: string;
  email: string;
  plan: 'free' | 'starter' | 'pro';
  creditsUsed: number;
  createdAt: string;
}

export interface AdminUsersResponse {
  users: AdminUser[];
  total: number;
  page: number;
  perPage: number;
}

export interface AdminRevenue {
  planBreakdown: {
    free: number;
    starter: number;
    pro: number;
  };
  paying: number;
  estimatedMRR: number;
  pricePerPlan: {
    free: number;
    starter: number;
    pro: number;
  };
}

export interface AdminGeneration {
  id: string;
  userId: string;
  productName: string;
  category: string;
  createdAt: string;
  tokensUsed: number;
  rating: number | null;
}

export interface AdminGenerationsResponse {
  generations: AdminGeneration[];
  total: number;
  page: number;
  perPage: number;
}

// ── Fetch helper ──────────────────────────────────────────────────────────────

async function adminFetch<T>(
  path: string,
  secret: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-admin-secret': secret,
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `Erro ${res.status}`);
  }

  return res.json();
}

// ── API functions ─────────────────────────────────────────────────────────────

export function getAdminStats(secret: string): Promise<AdminStats> {
  return adminFetch<AdminStats>('/api/admin/stats', secret);
}

export function getAdminUsers(
  secret: string,
  page = 1,
  perPage = 20,
  plan?: string,
): Promise<AdminUsersResponse> {
  const params = new URLSearchParams({ page: String(page), perPage: String(perPage) });
  if (plan && plan !== 'all') params.set('plan', plan);
  return adminFetch<AdminUsersResponse>(`/api/admin/users?${params}`, secret);
}

export function getAdminRevenue(secret: string): Promise<AdminRevenue> {
  return adminFetch<AdminRevenue>('/api/admin/revenue', secret);
}

export function getAdminGenerations(
  secret: string,
  page = 1,
  perPage = 20,
): Promise<AdminGenerationsResponse> {
  const params = new URLSearchParams({ page: String(page), perPage: String(perPage) });
  return adminFetch<AdminGenerationsResponse>(`/api/admin/generations?${params}`, secret);
}
