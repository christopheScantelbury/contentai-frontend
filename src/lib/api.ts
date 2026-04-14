const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

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

export async function generateContent(
  payload: GeneratePayload,
  token: string,
): Promise<GenerateResult> {
  const res = await fetch(`${API_URL}/api/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `Erro ${res.status}`);
  }

  return res.json();
}
