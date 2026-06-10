/* ============================================================
   TurNet — Firma ekleme
   ============================================================ */

let registerStep = 1;

function setRegisterStep(next) {
  registerStep = Math.max(1, Math.min(4, next));
  document.querySelectorAll("[data-step]").forEach((panel) => {
    panel.classList.toggle("active", Number(panel.dataset.step) === registerStep);
  });
  document.querySelectorAll("[data-step-pill]").forEach((pill) => {
    const n = Number(pill.dataset.stepPill);
    pill.classList.toggle("active", n === registerStep);
    pill.classList.toggle("done", n < registerStep);
  });
  document.getElementById("regPrev").hidden = registerStep === 1;
  document.getElementById("regNext").hidden = registerStep === 4;
  document.getElementById("regSubmit").hidden = registerStep !== 4;
  if (registerStep === 4) renderReview();
}

function activeCompanyType() {
  const selected = document.querySelector("#companyTypes .type-card.active");
  return selected ? selected.querySelector("b").textContent : "Otel";
}

function selectedServices() {
  return [...document.querySelectorAll("#serviceChips .pick-chip.active")].map((chip) => chip.textContent.trim());
}

function renderReview() {
  const country = document.getElementById("regCountry").value;
  const city = document.getElementById("regCity").value;
  const district = document.getElementById("regDistrict").value;
  const services = selectedServices();
  document.getElementById("registerReview").innerHTML = `
    <div class="qi-row"><span class="k">Firma tipi</span><span class="v">${activeCompanyType()}</span></div>
    <div class="qi-row"><span class="k">Firma adı</span><span class="v">${document.getElementById("companyName").value || "-"}</span></div>
    <div class="qi-row"><span class="k">Konum</span><span class="v">${[district, city, country].filter((v) => v && v !== "all").join(", ") || "-"}</span></div>
    <div class="qi-row"><span class="k">Hizmetler</span><span class="v">${services.join(", ") || "-"}</span></div>`;
}

function setupRegister() {
  setupCascade(
    document.getElementById("regCountry"),
    document.getElementById("regCity"),
    document.getElementById("regDistrict")
  );

  document.getElementById("companyTypes").addEventListener("click", (e) => {
    const card = e.target.closest(".type-card");
    if (!card) return;
    document.querySelectorAll("#companyTypes .type-card").forEach((c) => c.classList.remove("active"));
    card.classList.add("active");
  });

  document.getElementById("serviceChips").addEventListener("click", (e) => {
    const chip = e.target.closest(".pick-chip");
    if (!chip) return;
    chip.classList.toggle("active");
  });

  document.getElementById("regPrev").addEventListener("click", () => setRegisterStep(registerStep - 1));
  document.getElementById("regNext").addEventListener("click", () => setRegisterStep(registerStep + 1));
  document.getElementById("registerForm").addEventListener("submit", (e) => {
    e.preventDefault();
    document.querySelectorAll("#registerForm > .step-panel, #registerForm > .step-nav").forEach((el) => {
      el.hidden = true;
    });
    document.getElementById("registerSuccess").hidden = false;
  });

  setRegisterStep(1);
}

document.addEventListener("DOMContentLoaded", setupRegister);
