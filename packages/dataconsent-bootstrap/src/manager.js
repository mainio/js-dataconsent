import ConsentManager from "@mainiotech/dataconsent-core";
import Modal from "bootstrap/js/src/modal";
import tmpl from "./tmpl";

class BootstrapConsentManager extends ConsentManager {
  constructor(options) {
    options.template = tmpl;

    super(options);

    this.bootstrap = true;
  }

  showBanner() {
    this.bannerElement.classList.remove("d-none");
  }

  hideBanner() {
    this.bannerElement.classList.add("d-none");
  }

  showSettings() {
    this.hideBanner();
    this.settingsModal.show();
  }

  hideSettings() {
    this.settingsModal.hide();
  }

  _initializeModal() {
    super._initializeModal();

    this.settingsModal = new Modal(this.settingsElement.firstElementChild, {});
  }
}

export default BootstrapConsentManager;
