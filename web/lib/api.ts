import { getSupabaseBrowser, isMockMode } from "@/lib/supabase-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function bearerToken(): Promise<string | null> {
  if (isMockMode) return "mock-jwt-token";
  const sb = getSupabaseBrowser();
  const { data } = await sb!.auth.getSession();
  return data.session?.access_token ?? null;
}

export async function apiFetch<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await bearerToken();
  const headers = new Headers(init.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (!headers.has("Content-Type") && init.body && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_URL}${path}`, { ...init, headers });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`API ${res.status}: ${detail}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  me: () => apiFetch<{ user: any; profile: any; companies: any[] }>("/onboarding/me"),
  onboard: (payload: any) => apiFetch<{ profile_id: string; company_id: string }>("/onboarding", {
    method: "POST",
    body: JSON.stringify(payload),
  }),
  upload: (companyId: string, docType: string, file: File) => {
    const fd = new FormData();
    fd.append("company_id", companyId);
    fd.append("doc_type", docType);
    fd.append("file", file);
    return apiFetch<{ document_id: string; storage_path: string; parser_status: string }>(
      "/upload",
      { method: "POST", body: fd },
    );
  },
  listDocuments: (companyId: string) =>
    apiFetch<{ documents: any[] }>(`/upload/list/${companyId}`),
  startResearch: (companyId: string) =>
    apiFetch<{ research_id: string; status: string }>("/research/start", {
      method: "POST",
      body: JSON.stringify({ company_id: companyId }),
    }),
  getResearch: (researchId: string) =>
    apiFetch<any>(`/research/${researchId}`),
  startVoice: (companyId: string) =>
    apiFetch<{
      session_id: string;
      agent_id: string;
      conversation_id: string | null;
      signed_url: string | null;
      pre_brief: any;
      selected_questions: any[];
    }>("/voice/start", {
      method: "POST",
      body: JSON.stringify({ company_id: companyId }),
    }),
  finishVoice: (payload: { session_id: string; transcript: string; transcript_json?: any[]; duration_seconds?: number }) =>
    apiFetch<{ status: string; session_id: string }>("/voice/finish", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  startRun: (payload: { company_id: string; voice_session_id?: string; web_research_id?: string }) =>
    apiFetch<{ run_id: string; status: string }>("/run/start", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getRun: (runId: string) =>
    apiFetch<{ run: any; results: Record<string, any> }>(`/run/${runId}`),
  listRuns: (companyId: string) =>
    apiFetch<{ runs: Array<{ id: string; status: string; current_step: string; created_at: string; completed_at: string | null }> }>(
      `/run/list/${companyId}`,
    ),
  setOperations: (runId: string, operations: Record<string, string>) =>
    apiFetch<{ status: string; operations: Record<string, string> }>(`/run/${runId}/operations`, {
      method: "PATCH",
      body: JSON.stringify({ operations }),
    }),
  downloadDeliverable: (runId: string, fmt: "xlsx" | "pptx" | "pdf") =>
    apiFetch<{ format: string; signed_url: string; expires_in: number }>(`/run/${runId}/download/${fmt}`),
  fetchTranscript: (payload: { conversation_id: string; session_id: string }) =>
    apiFetch<{ transcript: string; duration_seconds?: number; message_count?: number }>(
      "/webhooks/elevenlabs/fetch-transcript",
      { method: "POST", body: JSON.stringify(payload) },
    ),
};
