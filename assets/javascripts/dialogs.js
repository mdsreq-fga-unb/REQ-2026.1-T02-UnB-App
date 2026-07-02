(() => {
  const focusableSelector = [
    "button:not([disabled])",
    "[href]",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
  ].join(",");

  function initDialogs(root = document) {
    root.querySelectorAll("[data-dialog-open]").forEach((trigger) => {
      if (trigger.dataset.dialogReady === "true") {
        return;
      }

      const dialog = document.getElementById(trigger.dataset.dialogOpen);
      if (!dialog) {
        return;
      }

      trigger.dataset.dialogReady = "true";

      const closeDialog = () => {
        if (typeof dialog.close === "function") {
          dialog.close();
        } else {
          dialog.removeAttribute("open");
        }
        trigger.focus();
      };

      trigger.addEventListener("click", () => {
        if (typeof dialog.showModal === "function") {
          dialog.showModal();
        } else {
          dialog.setAttribute("open", "");
        }

        const firstFocusable = dialog.querySelector(focusableSelector);
        if (firstFocusable) {
          firstFocusable.focus();
        }
      });

      dialog.querySelectorAll("[data-dialog-close]").forEach((closeButton) => {
        closeButton.addEventListener("click", closeDialog);
      });

      dialog.addEventListener("click", (event) => {
        if (event.target === dialog) {
          closeDialog();
        }
      });

      dialog.addEventListener("cancel", (event) => {
        event.preventDefault();
        closeDialog();
      });
    });
  }

  if (typeof document$ !== "undefined") {
    document$.subscribe(() => initDialogs());
  } else {
    document.addEventListener("DOMContentLoaded", () => initDialogs());
  }
})();
