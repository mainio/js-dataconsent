import { parse as parseCookies } from "cookie";

class ConsentManager {
  constructor(options) {
    this.consentCategories = Object.assign({}, options.categories);
    this.template = Object.assign({
      banner: () => "",
      modal: () => "",
    }, options.template);

    this._initializeBanner();
    this._initializeModal();

    this.waitingTrigger = false;
    this.contentReady = false;
    if (document.readyState === "complete"
      || document.readyState === "loaded"
      || document.readyState === "interactive"
    ) {
      this.contentReady = true;
    } else {
      document.addEventListener("DOMContentLoaded", () => {
        this.contentReady = true;
      });
    }

    const cookies = parseCookies(document.cookie);
    if (cookies.dc) {
      try {
        this.state = cookies.dc.split(",");
      } catch {
        // Invalid data in the dc cookie
      }
    }

    if (this.state) {
      Array.from(this.settingsElement.querySelectorAll("input[type='checkbox']")).forEach((input) => {
        if (input.disabled) {
          return;
        }

        if (this.state.includes(input.name)) {
          input.checked = true;
        }
      });

      this.triggerState();
    } else {
      this.showBanner();
    }
  }

  triggerState() {
    const trigger = () => {
      document.querySelectorAll("script[type='text/plain'][data-dc]").forEach((script) => {
        if (this.state.includes(script.dataset.dc)) {
          const activeScript = document.createElement("script");
          if (script.src.length > 0) {
            activeScript.src = script.src;
          } else {
            activeScript.innerHTML = script.innerHTML;
          }
          script.parentNode.replaceChild(activeScript, script);
        }
      });

      const event = new CustomEvent("dataconsent", { detail: this.state });
      document.dispatchEvent(event);
    };

    if (this.contentReady) {
      trigger();
    } else if (!this.waitingTrigger) {
      this.waitingTrigger = true;
      document.addEventListener("DOMContentLoaded", trigger);
    }
  }

  acceptAll() {
    this.hideBanner();

    this.settingsElement.querySelectorAll("input[type='checkbox']").forEach((input) => {
      input.checked = true;
    });

    this.saveState();
  }

  rejectAll() {
    this.hideBanner();

    this.settingsElement.querySelectorAll("input[type='checkbox']").forEach((input) => {
      if (input.disabled) {
        return;
      }

      input.checked = false;
    });

    this.saveState();
  }

  showBanner() {
    this.settingsElement.style.display = "block";
  }

  hideBanner() {
    this.settingsElement.style.display = "none";
  }

  showSettings() {
    this.hideBanner();
    this.settingsElement.style.display = "block";
  }

  hideSettings() {
    this.settingsElement.style.display = "none";
  }

  saveSettings() {
    this.hideSettings();
    this.saveState();
  }

  closeSettings() {
    this.hideSettings();

    if (!this.state) {
      this.showBanner();
    }
  }

  getAllowedCategories() {
    return Array.from(this.settingsElement.querySelectorAll("input[type='checkbox']")).filter((input) => {
      return input.checked;
    }).map((input) => {
      return input.name;
    });
  }

  saveState() {
    this.state = this.getAllowedCategories();

    // Set the cookie and make it expire in 365 days
    const date = new Date();
    date.setTime(date.getTime() + (365 * 24 * 3600 * 1000));
    document.cookie = `dc=${this.state.join(",")};expires=${date.toUTCString()};path=/`;

    // Trigger the event telling the state
    this.triggerState();
  }

  _initializeBanner() {
    // Keep the banner element as the first element in the body so that keyboard
    // users would access it the first thing on the page. Associate some
    // classes, attributes and comments with the element to try to hide it from
    // the search engines as instructed at:
    // https://en.wikipedia.org/wiki/Noindex
    // https://developers.google.com/search/docs/advanced/robots/robots_meta_tag#data-nosnippet-attr
    this.bannerElement = document.createElement("div");
    this.bannerElement.id = "cookie-banner";
    this.bannerElement.classList.add("robots-noindex", "robots-nocontent", "noindex");
    this.bannerElement.setAttribute("data-nosnippet", "");
    this.bannerElement.appendChild(document.createComment("noindex"));
    this.bannerElement.appendChild(document.createComment("googleoff: all"));
    this.bannerElement.insertAdjacentHTML("beforeend", this.template.banner());
    this.bannerElement.appendChild(document.createComment("googleon: all"));
    this.bannerElement.appendChild(document.createComment("/noindex"));
    this.hideBanner();
    document.body.prepend(this.bannerElement);

    this.bannerElement.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.dcAction;
        if (action === "accept") {
          this.acceptAll();
        } else if (action === "reject") {
          this.rejectAll();
        } else if (action === "settings") {
          this.showSettings();
        }
      });
    });
  }

  _initializeModal() {
    this.settingsElement = document.createElement("div");
    this.settingsElement.id = "cookie-settings";
    this.settingsElement.innerHTML = this.template.modal(this.consentCategories);
    document.body.appendChild(this.settingsElement);

    this.settingsElement.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.dcAction;
        if (action === "save") {
          this.saveSettings();
        } else if (action === "close") {
          this.closeSettings();
        }
      });
    });
  }
}

export default ConsentManager;
