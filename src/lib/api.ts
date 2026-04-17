const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

// ── Helpers ───────────────────────────────────────────────────────────────────

async function apiFetch<T>(
  path: string,
  token: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `Erro ${res.status}`);
  }

  return res.json();
}

// ── /api/generate ─────────────────────────────────────────────────────────────

interface GeneratePayload {
  name: string;
  category: string;
  features: string;
  imageBase64?: string;
  imageMimeType?: string;
}

export interface GenerateResult {
  title: string;
  shortDescription: string;
  longDescription: string;
  bullets: string[];
  tokensUsed?: number;
  generationTimeMs?: number;
}

export function generateContent(
  payload: GeneratePayload,
  token: string,
): Promise<GenerateResult> {
  return apiFetch('/api/generate', token, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ── /api/usage ────────────────────────────────────────────────────────────────

export type Plan = 'free' | 'starter' | 'pro';

export interface UsageData {
  plan:               Plan;
  credits_used:       number;
  credits_limit:      number | null;
  credits_remaining:  number | null;
  reset_at:           string;
  total_generations:  number;
  last_generation_at: string | null;
}

export function getUsage(token: string): Promise<UsageData> {
  return apiFetch('/api/usage', token);
}

// ── /api/feedback ─────────────────────────────────────────────────────────────

export interface FeedbackPayload {
  generation_id: string;
  rating:        number;
  comment?:      string;
}

export interface FeedbackResponse {
  id:            string;
  generation_id: string;
  rating:        number;
  comment?:      string | null;
  created_at:    string;
}

export function postFeedback(
  payload: FeedbackPayload,
  token: string,
): Promise<FeedbackResponse> {
  return apiFetch('/api/feedback', token, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
