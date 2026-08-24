const DEFAULT_SUPABASE_TIMEOUT_MS = 10_000;

function timeoutMs() {
  const configured = Number(process.env.SUPABASE_FETCH_TIMEOUT_MS);
  return Number.isFinite(configured) && configured > 0
    ? configured
    : DEFAULT_SUPABASE_TIMEOUT_MS;
}

/** Prevent a slow/unreachable Supabase request from retaining an SSR render forever. */
export const fetchWithSupabaseTimeout: typeof fetch = async (input, init) => {
  const controller = new AbortController();
  const sourceSignal = init?.signal;
  const abortFromSource = () => controller.abort(sourceSignal?.reason);
  const timer = setTimeout(
    () => controller.abort(new DOMException("Supabase request timed out", "TimeoutError")),
    timeoutMs(),
  );

  if (sourceSignal?.aborted) abortFromSource();
  else sourceSignal?.addEventListener("abort", abortFromSource, { once: true });

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
    sourceSignal?.removeEventListener("abort", abortFromSource);
  }
};
