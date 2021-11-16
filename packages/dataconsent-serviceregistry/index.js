import services from "./services";
import locales from "./locales";

/**
 * Returns the service definitions in the given locale.
 *
 * @param {String} locale The locale in which to get the translations.
 * @returns {Object} An object containing the service definitions and the
 *   translations for their explanations in the given locale.
 */
export default (locale) => {
  return {
    services,
    locales: locales[locale],
  }
};
