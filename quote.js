/* ============================================================
   TurNet — Teklif formu
   ============================================================ */

let quoteStep = 1;

function selectedIds() {
  const ids = new Set(getCart());
  const param = qparam("s");
  if (param) ids.add(Number(param));
  if (!ids.size) ids.add(LISTINGS[0].id);
  setCart([...ids]);
  return [...ids];
}

function renderSelectedSuppliers() {
  const wrap = document.getElementById("selectedSuppliers");
  const suppliers = selectedIds().map(getListing).filter(Boolean);
  if (!suppliers.length) {
    wrap.innerHTML = `<p class="empty-sel">Henüz tedarikçi seçilmedi.</p>`;
    return;
  }

  wrap.innerHTML = suppliers.map((l) => `
    <div class="sel-supplier">
      <div class="sel-avatar cover-${l.cat}">${initials(l.name)}</div>
      <div class="s-body">
        <b>${l.name}</b>
        <span>${catLabel(l.cat)} · ${l.city}</span>
      </div>
      <button type="button" class="rm" data-remove="${l.id}" aria-label="Kaldır">×</button>
    </div>`).join("");
}

function setQuoteStep(next) {
  quoteStep = Math.max(1, Math.min(3, next));
  document.querySelectorAll("[data-step]").forEach((panel) => {
    panel.classList.toggle("active", Number(panel.dataset.step) === quoteStep);
  });
  document.querySelectorAll("[data-step-pill]").forEach((pill) => {
    const n = Number(pill.dataset.stepPill);
    pill.classList.toggle("active", n === quoteStep);
    pill.classList.toggle("done", n < quoteStep);
  });
  document.getElementById("prevStep").hidden = quoteStep === 1;
  document.getElementById("nextStep").hidden = quoteStep === 3;
  document.getElementById("submitQuote").hidden = quoteStep !== 3;
}

function setupQuoteForm() {
  setupCascade(
    document.getElementById("requestCountry"),
    document.getElementById("requestCity"),
    document.getElementById("requestDistrict")
  );

  document.getElementById("requestTypes").addEventListener("click", (e) => {
    const chip = e.target.closest(".pick-chip");
    if (!chip) return;
    document.querySelectorAll("#requestTypes .pick-chip").forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
  });

  document.querySelector(".count-stepper").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-count]");
    if (!btn) return;
    const input = document.getElementById("peopleCount");
    input.value = Math.max(1, Number(input.value || 1) + Number(btn.dataset.count));
  });

  document.getElementById("prevStep").addEventListener("click", () => setQuoteStep(quoteStep - 1));
  document.getElementById("nextStep").addEventListener("click", () => setQuoteStep(quoteStep + 1));

  document.getElementById("selectedSuppliers").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-remove]");
    if (!btn) return;
    removeFromCart(Number(btn.dataset.remove));
    renderSelectedSuppliers();
  });

  document.getElementById("quoteForm").addEventListener("submit", (e) => {
    e.preventDefault();
    document.querySelector(".quote-layout > section").querySelectorAll(".step-panel, .step-nav").forEach((el) => {
      el.hidden = true;
    });
    document.getElementById("quoteSuccess").hidden = false;
    setCart([]);
  });

  renderSelectedSuppliers();
  setQuoteStep(1);
}

document.addEventListener("DOMContentLoaded", setupQuoteForm);
document.addEventListener("langchange", renderSelectedSuppliers);
