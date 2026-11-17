/**
 * KIIDA Single-Page Website — Interactive Client Script
 *
 * 1. Feature-Detected Popover Polyfill
 * 2. Responsive Site Navigation (inline vs. popover + scroll-spy)
 * 3. In-Page Bilingual Language Switcher (EN / ID)
 * 4. Accessible Contact/Signup Tabs (selection-follows-focus + beforematch)
 * 5. Native <dialog> Modals for Privacy Policy & Terms (with closedby="any" fallback)
 * 6. Accessible Form Validation & Submission (validate-input-after-interaction)
 */

if (!Object.hasOwn(HTMLElement.prototype, "popover")) {
  import("https://unpkg.com/@oddbird/popover-polyfill@latest/dist/popover.min.js").catch(() => {});
}

/* ==========================================================================
   1. Responsive Site Navigation (modern-web-guidance: navbar)
   ========================================================================== */

export function initResponsiveNavbar() {
  const header = document.querySelector(".site-header");
  const inner = document.querySelector(".header-inner");
  const menu = document.getElementById("site-menu");

  if (!header || !inner || !menu) return;

  let lastCollapsedWidth = 0;

  function updateNavLayout() {
    let wasOpen = false;
    try {
      wasOpen = menu.matches(":popover-open, .\\:popover-open");
    } catch {
      wasOpen = false;
    }

    header.classList.add("is-measuring");
    header.classList.add("is-wide");
    menu.removeAttribute("popover");

    const fits = inner.scrollWidth <= inner.clientWidth;

    if (fits) {
      header.classList.add("is-wide");
    } else {
      header.classList.remove("is-wide");
      lastCollapsedWidth = header.clientWidth;
      menu.setAttribute("popover", "auto");
      if (wasOpen) {
        menu.showPopover?.();
      }
    }

    requestAnimationFrame(() => {
      header.classList.remove("is-measuring");
    });
  }

  window.refreshKiidaNavLayout = updateNavLayout;
  updateNavLayout();

  const resizeObserver = new ResizeObserver(() => {
    if (header.classList.contains("is-wide")) {
      updateNavLayout();
    } else if (header.clientWidth > lastCollapsedWidth) {
      updateNavLayout();
    }
  });

  resizeObserver.observe(header);
  resizeObserver.observe(menu);

  menu.addEventListener("click", (event) => {
    const target = event.target.closest("a, button[data-lang-toggle]");
    if (!target || !menu.contains(target)) return;
    if (!header.classList.contains("is-wide")) {
      menu.hidePopover?.();
    }
  });
}

/* ==========================================================================
   2. Single-Page Scroll Spy (aria-current="location")
   ========================================================================== */

export function initScrollSpy() {
  const navLinks = Array.from(document.querySelectorAll('.site-menu a[href^="#"]')).filter(
    (link) => !link.classList.contains("nav-cta-link")
  );
  if (!navLinks.length) return;

  const linkMap = new Map();
  const sections = [];

  for (const link of navLinks) {
    const id = link.getAttribute("href")?.slice(1);
    if (!id) continue;
    const section = document.getElementById(id);
    if (section) {
      linkMap.set(id, link);
      sections.push(section);
    }
  }

  if (!sections.length) return;

  function setCurrent(id) {
    for (const [secId, link] of linkMap.entries()) {
      if (secId === id) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    }
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const id = link.getAttribute("href")?.slice(1);
      if (id) setCurrent(id);
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible.length) {
        setCurrent(visible[0].target.id);
      }
    },
    {
      rootMargin: "-20% 0px -65% 0px",
      threshold: [0, 0.25, 0.5]
    }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ==========================================================================
   3. In-Page Language Switcher (EN / ID)
   ========================================================================== */

export function initLanguageSwitch() {
  const toggleButtons = document.querySelectorAll("[data-lang-toggle]");
  const explicitButtons = document.querySelectorAll("[data-set-lang]");
  const metaDesc = document.querySelector('meta[name="description"]');

  function applyLanguage(lang, persist = true) {
    const nextLang = lang === "id" ? "id" : "en";
    document.documentElement.lang = nextLang;

    const title = nextLang === "id" ? document.body.dataset.titleId : document.body.dataset.titleEn;
    if (title) document.title = title;

    const desc = nextLang === "id" ? document.body.dataset.descId : document.body.dataset.descEn;
    if (metaDesc && desc) metaDesc.setAttribute("content", desc);

    toggleButtons.forEach((btn) => {
      btn.setAttribute(
        "aria-label",
        nextLang === "id" ? "Ganti bahasa ke English" : "Switch language to Bahasa Indonesia"
      );
      btn.setAttribute("aria-pressed", String(nextLang === "id"));
    });

    if (persist) {
      try {
        localStorage.setItem("kiida_lang", nextLang);
      } catch {
        // Ignore storage errors in private browsing
      }
    }

    requestAnimationFrame(() => {
      window.refreshKiidaNavLayout?.();
    });
  }

  let initialLang = document.documentElement.lang === "id" ? "id" : "en";
  try {
    const queryLang = new URLSearchParams(window.location.search).get("lang");
    const saved = localStorage.getItem("kiida_lang");
    if (queryLang === "id" || queryLang === "en") initialLang = queryLang;
    else if (saved === "id" || saved === "en") initialLang = saved;
  } catch {
    // Keep default HTML lang
  }
  applyLanguage(initialLang, false);

  toggleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const current = document.documentElement.lang === "id" ? "id" : "en";
      applyLanguage(current === "id" ? "en" : "id");
    });
  });

  explicitButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetLang = btn.getAttribute("data-set-lang");
      if (targetLang) applyLanguage(targetLang);
    });
  });
}

/* ==========================================================================
   4. Accessible Form Tabs (modern-web-guidance: tabs)
   ========================================================================== */

export function initTabs() {
  const tablists = document.querySelectorAll('[role="tablist"]');
  if (!tablists.length) return;

  function activateTab(tablist, targetTab, focusTab = false) {
    const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
    const container = tablist.closest(".tabs-container") || tablist.parentElement;
    if (!container) return;

    const panels = Array.from(container.querySelectorAll('[role="tabpanel"]'));

    tabs.forEach((tab) => {
      const selected = tab === targetTab;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });

    panels.forEach((panel) => {
      const ownerId = panel.getAttribute("aria-labelledby");
      const isMatch = ownerId === targetTab.id;
      if (isMatch) {
        panel.removeAttribute("hidden");
      } else {
        panel.setAttribute("hidden", "until-found");
      }
    });

    targetTab.scrollIntoView?.({ block: "nearest", inline: "nearest" });
    if (focusTab) targetTab.focus();
  }

  tablists.forEach((tablist) => {
    const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
    const container = tablist.closest(".tabs-container") || tablist.parentElement;

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        activateTab(tablist, tab, false);
      });
    });

    tablist.addEventListener("keydown", (event) => {
      const currentIndex = tabs.indexOf(document.activeElement);
      if (currentIndex === -1) return;

      let nextIndex = null;
      if (event.key === "ArrowRight") {
        nextIndex = (currentIndex + 1) % tabs.length;
      } else if (event.key === "ArrowLeft") {
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = tabs.length - 1;
      }

      if (nextIndex !== null) {
        event.preventDefault();
        activateTab(tablist, tabs[nextIndex], true);
      }
    });

    // Sync tab selection when find-in-page reveals a hidden="until-found" panel
    if (container) {
      container.querySelectorAll('[role="tabpanel"]').forEach((panel) => {
        panel.addEventListener("beforematch", () => {
          const tabId = panel.getAttribute("aria-labelledby");
          const matchingTab = tabId ? document.getElementById(tabId) : null;
          if (matchingTab) activateTab(tablist, matchingTab, false);
        });
      });
    }
  });

  // External shortcut buttons / anchor links that select a specific tab (e.g., "Apply to Partner")
  document.querySelectorAll("[data-select-tab]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const tabKey = trigger.getAttribute("data-select-tab");
      if (!tabKey) return;
      tablists.forEach((tablist) => {
        const match = tablist.querySelector(`[role="tab"][data-tab-key="${tabKey}"]`);
        if (match) activateTab(tablist, match, false);
      });
    });
  });
}

/* ==========================================================================
   5. Native <dialog> Legal Modals (modern-web-guidance: dialog, light-dismiss-a-dialog)
   ========================================================================== */

export function initDialogs() {
  const dialogs = document.querySelectorAll("dialog.legal-dialog");
  if (!dialogs.length) return;

  function openByHash() {
    const hash = window.location.hash;
    if (hash === "#privacy" || hash === "#privacy-dialog") {
      const dlg = document.getElementById("privacy-dialog");
      if (dlg && !dlg.open) dlg.showModal();
    } else if (hash === "#terms" || hash === "#terms-dialog") {
      const dlg = document.getElementById("terms-dialog");
      if (dlg && !dlg.open) dlg.showModal();
    }
  }

  document.querySelectorAll("[data-open-dialog]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      const targetId = trigger.getAttribute("data-open-dialog");
      const dialog = targetId ? document.getElementById(targetId) : null;
      if (dialog && typeof dialog.showModal === "function") {
        event.preventDefault();
        if (!dialog.open) dialog.showModal();
      }
    });
  });

  // Mandatory fallback for browsers without native `closedby="any"` support
  if (!("closedBy" in HTMLDialogElement.prototype)) {
    document.querySelectorAll('dialog[closedby="any"]').forEach((dialog) => {
      dialog.addEventListener("click", (event) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const isDialogContent =
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width;
        if (isDialogContent) return;
        dialog.close();
      });
    });
  }

  window.addEventListener("hashchange", openByHash);
  openByHash();
}

/* ==========================================================================
   6. Accessible Form Validation & Submission (validate-input-after-interaction)
   ========================================================================== */

export function initForms() {
  const forms = document.querySelectorAll("form[data-kiida-form]");
  if (!forms.length) return;

  const linkError = (el, shown) => {
    const errorId = el.dataset.error;
    if (!errorId) return;
    const ids = (el.getAttribute("aria-describedby") || "")
      .split(/\s+/)
      .filter((id) => id && id !== errorId);
    if (shown) ids.push(errorId);
    if (ids.length) el.setAttribute("aria-describedby", ids.join(" "));
    else el.removeAttribute("aria-describedby");
  };

  const announcer = document.createElement("div");
  announcer.setAttribute("aria-live", "polite");
  announcer.classList.add("visually-hidden");
  document.body.append(announcer);
  let announceTimer;
  let announcedField;

  const spokenText = (node) => {
    const copy = node.cloneNode(true);
    copy.querySelectorAll('[aria-hidden="true"]').forEach((n) => n.remove());
    copy.querySelectorAll('[role="img"][aria-label]').forEach((n) => {
      n.replaceWith(`${n.getAttribute("aria-label")}: `);
    });
    return copy.textContent.replace(/\s+/g, " ").trim();
  };

  const announceError = (el) => {
    const error = document.getElementById(el.dataset.error);
    if (!error) return;
    const label = el.labels?.[0] ? `${spokenText(el.labels[0])}: ` : "";
    clearTimeout(announceTimer);
    announcer.textContent = "";
    announcedField = el;
    announceTimer = setTimeout(() => {
      announcer.textContent = label + spokenText(error);
    }, 500);
  };

  const flagged = new WeakSet();
  const announced = new WeakSet();

  const syncAria = (el, announce = false) => {
    if (!el.matches?.("input, select, textarea")) return;
    let invalid = false;
    try {
      invalid = el.matches(":user-invalid") || el.classList.contains("user-invalid-fallback");
    } catch {
      invalid = el.classList.contains("user-invalid-fallback");
    }

    if (invalid) {
      if (announce && !announced.has(el)) {
        announceError(el);
        announced.add(el);
      }
      el.setAttribute("aria-invalid", "true");
      linkError(el, true);
      flagged.add(el);
    } else if (flagged.has(el) || el.getAttribute("aria-invalid") !== "true") {
      el.setAttribute("aria-invalid", "false");
      linkError(el, false);
      flagged.delete(el);
      announced.delete(el);
      if (announcedField === el) {
        clearTimeout(announceTimer);
        announcer.textContent = "";
      }
    }
  };

  document.querySelectorAll("input, select, textarea").forEach((el) => syncAria(el));

  document.addEventListener("blur", (e) => syncAria(e.target, true), true);
  document.addEventListener("input", (e) => {
    if (e.target.hasAttribute("aria-invalid")) syncAria(e.target);
  });
  document.addEventListener("change", (e) => syncAria(e.target, true), true);
  document.addEventListener(
    "invalid",
    (e) => {
      announced.add(e.target);
      syncAria(e.target);
    },
    true
  );

  // Handle form submission (Formspree endpoint if configured, otherwise pre-filled mailto + status confirmation)
  const formEndpoint = document.body.dataset.formEndpoint || "";

  forms.forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        const firstInvalid = form.querySelector(":invalid");
        firstInvalid?.focus();
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const statusBox = form.querySelector(".form-status");
      const recipientEmail = form.dataset.recipient || document.body.dataset.defaultEmail || "hello@kiida.app";
      const subjectPrefix = form.dataset.subject || "KIIDA Inquiry";

      const data = new FormData(form);
      const entries = [];
      for (const [key, value] of data.entries()) {
        if (value) entries.push(`${key}: ${value}`);
      }

      if (submitBtn) submitBtn.disabled = true;

      if (formEndpoint) {
        try {
          await fetch(formEndpoint, {
            method: "POST",
            body: data,
            headers: { Accept: "application/json" }
          });
        } catch {
          // Fallback to mailto if network call fails
        }
      } else {
        const mailtoUrl = `mailto:${encodeURIComponent(recipientEmail)}?subject=${encodeURIComponent(
          subjectPrefix
        )}&body=${encodeURIComponent(entries.join("\n"))}`;
        window.location.href = mailtoUrl;
      }

      if (statusBox) {
        statusBox.hidden = false;
      }
      form.reset();
      if (submitBtn) {
        setTimeout(() => {
          submitBtn.disabled = false;
        }, 2000);
      }
    });
  });
}

function initApp() {
  initResponsiveNavbar();
  initScrollSpy();
  initLanguageSwitch();
  initTabs();
  initDialogs();
  initForms();
  requestAnimationFrame(() => document.body.classList.add("is-ready"));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
