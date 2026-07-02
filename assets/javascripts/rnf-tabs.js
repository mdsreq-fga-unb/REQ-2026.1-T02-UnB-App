(() => {
  const RNF_HASH = /^#rnf\d{2}$/i;

  function activateTabbedBlockFor(target) {
    const block = target.closest(".tabbed-block");
    const tabbedSet = target.closest(".tabbed-set");

    if (!block || !tabbedSet) {
      return false;
    }

    const blocks = Array.from(tabbedSet.querySelectorAll(":scope > .tabbed-content > .tabbed-block"));
    const index = blocks.indexOf(block);

    if (index < 0) {
      return false;
    }

    const tabs = Array.from(tabbedSet.querySelectorAll(":scope > input"));
    const tab = tabs[index];

    if (!tab) {
      return false;
    }

    tab.checked = true;
    tab.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  }

  function showRnfFromHash() {
    const hash = window.location.hash;

    if (!RNF_HASH.test(hash)) {
      return;
    }

    const target = document.getElementById(hash.slice(1));

    if (!target) {
      return;
    }

    activateTabbedBlockFor(target);

    window.setTimeout(() => {
      target.scrollIntoView({ block: "start" });
    }, 50);
  }

  function initRnfTabs() {
    showRnfFromHash();

    document.querySelectorAll('a[href*="#rnf"]').forEach((link) => {
      if (link.dataset.rnfTabsReady === "true") {
        return;
      }

      link.dataset.rnfTabsReady = "true";
      link.addEventListener("click", () => {
        window.setTimeout(showRnfFromHash, 0);
      });
    });
  }

  window.addEventListener("hashchange", showRnfFromHash);

  if (typeof document$ !== "undefined") {
    document$.subscribe(() => initRnfTabs());
  } else {
    document.addEventListener("DOMContentLoaded", () => initRnfTabs());
  }
})();
