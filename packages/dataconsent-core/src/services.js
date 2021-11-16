/**
 * Converts the service category an translations into cookie category
 * definitions for the consent manager.
 *
 * @param {Object} serviceRegistry The registry of the services and the
 *   translations for their local data definitions.
 * @param {Object} translations The translations for the general texts.
 * @param {Array} requestedServices An array of string for the requested
 *   services.
 * @returns {Object} The final categories for the services.
 */
export default (serviceRegistry, translations, requestedServices) => {
  const serviceTranslations = serviceRegistry.locales;

  // Add the cookies controlled by the dataconsent system and remove duplicates
  // through the set.
  const services = [...new Set(["__"].concat(requestedServices))];

  // Create the data categories
  const dataArray = {};
  const categories = ["necessary", "preferences", "analytics", "marketing"];
  categories.forEach((key) => {
    dataArray[key] = {
      name: translations.categories[key].name,
      description: translations.categories[key].description,
      data: [],
    };
  });
  dataArray.necessary.required = true;

  // Add the requested services to the correct categories
  services.forEach((serviceKey) => {
    const service = serviceRegistry.services[serviceKey];
    const serviceLocales = serviceTranslations[serviceKey];

    categories.forEach((category) => {
      const serviceCategory = service[category];
      if (!serviceCategory) {
        return;
      }

      ["cookie", "localStorage"].forEach((type) => {
        const serviceType = serviceCategory[type];
        if (!serviceType) {
          return;
        }

        serviceType.forEach((key) => {
          dataArray[category].data.push({
            type: type,
            provider: serviceLocales.provider,
            name: key,
            purpose: serviceLocales[type][key],
          });
        });
      });
    });
  });

  // Remove empty categories
  categories.forEach((key) => {
    if (dataArray[key].data.length < 1) {
      Reflect.deleteProperty(dataArray, key);
    }
  });

  return dataArray;
};
