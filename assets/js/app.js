(function () {
  "use strict";

  // ====== Util ======
  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  // ====== Filtro de cards em pontos.xhtml ======
  const pontosRoot = qs("[data-page='pontos']");
  if (pontosRoot) {
    const categorySel = qs("#filterCategory");
    const searchInput = qs("#filterSearch");
    const cards = qsa("[data-card]", pontosRoot);

    function applyFilters() {
      const cat = (categorySel && categorySel.value) ? categorySel.value : "all";
      const term = (searchInput && searchInput.value) ? searchInput.value.toLowerCase().trim() : "";

      cards.forEach(function(card){
        const c = card.getAttribute("data-category") || "";
        const text = (card.textContent || "").toLowerCase();

        const matchCat = (cat === "all") ? true : (c === cat);
        const matchTerm = (term === "") ? true : (text.indexOf(term) !== -1);

        card.style.display = (matchCat && matchTerm) ? "" : "none";
      });
    }

    if (categorySel) categorySel.addEventListener("change", applyFilters);
    if (searchInput) searchInput.addEventListener("input", applyFilters);

    applyFilters();
  }

  // ====== Checklist em descarte.xhtml (persistente) ======
  const checklistRoot = qs("[data-page='descarte']");
  if (checklistRoot) {
    const items = qsa("[data-check]", checklistRoot);
    const resetBtn = qs("#resetChecklist", checklistRoot);
    const key = "aps_elixo_checklist_v1";

    function loadState() {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : {};
      } catch (e) {
        return {};
      }
    }

    function saveState(state) {
      try {
        localStorage.setItem(key, JSON.stringify(state));
      } catch (e) { /* ignore */ }
    }

    function syncFromState() {
      const state = loadState();
      items.forEach(function(el){
        const id = el.getAttribute("data-check");
        const cb = qs("input[type='checkbox']", el);
        if (!id || !cb) return;
        cb.checked = !!state[id];
      });
    }

    function bind() {
      items.forEach(function(el){
        const id = el.getAttribute("data-check");
        const cb = qs("input[type='checkbox']", el);
        if (!id || !cb) return;
        cb.addEventListener("change", function(){
          const state = loadState();
          state[id] = cb.checked;
          saveState(state);
        });
      });

      if (resetBtn) {
        resetBtn.addEventListener("click", function(){
          saveState({});
          syncFromState();
        });
      }
    }

    syncFromState();
    bind();
  }
})();
