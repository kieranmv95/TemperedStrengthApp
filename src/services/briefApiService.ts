import type { GlossaryTerm } from '@/src/types/brief';

const BASE = 'https://www.temperedstrength.com/api';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function fetchGlossary(): Promise<GlossaryTerm[]> {
  const response = await fetch(`${BASE}/glossary`);
  return handleResponse<GlossaryTerm[]>(response);
}
