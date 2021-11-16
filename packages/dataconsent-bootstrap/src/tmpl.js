import i18n from "@mainiotech/dataconsent-i18n";

const banner = () => {
  const translations = i18n.getTranslations();

  return `
    <div class="position-fixed bottom-0 start-0 end-0 bg-dark text-white p-4" style="z-index:9999;">
      <div class="d-flex flex-column flex-md-row justify-content-between">
        <div class="item">
          ${translations.banner.notification}
        </div>
        <div class="item">
          <div class="d-flex flex-column flex-lg-row mt-4 mt-md-0">
            <button type="button" data-dc-action="accept" class="btn btn-sm btn-primary text-nowrap mb-2 mb-lg-0 mx-md-2">${translations.banner.accept}</button>
            <button type="button" data-dc-action="reject" class="btn btn-sm btn-outline-primary text-nowrap mb-2 mb-lg-0 mx-md-2">${translations.banner.reject}</button>
            <button type="button" data-dc-action="settings" class="btn btn-sm btn-link text-white text-nowrap mb-2 mb-lg-0 mx-md-2">${translations.banner.settings}</button>
          </div>
        </div>
      </div>
    </div>
  `;
};

const modal = (consentData) => {
  const translations = i18n.getTranslations();

  const generateDetailsTable = (details) => {
    const rows = details.map((detail) => {
      return `
        <tr>
          <td>${translations.dataInfo.types[detail.type]}</td>
          <td>${detail.name}</td>
          <td>${detail.provider}</td>
          <td>${detail.purpose}</td>
        </tr>
      `;
    });

    return `
      <table class="table table-sm small">
        <thead>
          <tr>
            <th>${translations.dataInfo.type}</th>
            <th>${translations.dataInfo.name}</th>
            <th>${translations.dataInfo.service}</th>
            <th>${translations.dataInfo.purpose}</th>
          </tr>
        </thead>
        <tbody>
          ${rows.join("\n")}
        </tbody>
      </table>
    `;
  };

  const generateCategories = () => {
    return Object.keys(consentData).map((key) => {
      const category = consentData[key];

      let input = `<input class="form-check-input" type="checkbox" id="dc_${key}" name="${key}"`;
      if (category.required) {
        input += " checked disabled";
      }
      input += ">";

      return `
        <div class="modal-body border-top">
          <div class="form-check form-switch">
            ${input}
            <label class="form-check-label" for="dc_${key}">${category.name}</label>
          </div>
          <p class="mb-0 small">${category.description}</p>
          <div class="table-responsive">
            ${generateDetailsTable(category.data)}
          </div>
        </div>
      `;
    })
  };

  return `
    <div class="modal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${translations.settings.title}</h5>
          </div>
          <div class="modal-body">
            <p class="mb-0">${translations.settings.body}</p>
          </div>
          ${generateCategories().join("\n")}
          <div class="modal-footer justify-content-between">
            <button type="button" data-dc-action="close" class="btn btn-secondary">${translations.settings.close}</button>
            <button type="button" data-dc-action="save" class="btn btn-primary">${translations.settings.save}</button>
          </div>
        </div>
      </div>
    </div>
  `;
};

export default {
  modal,
  banner,
};
