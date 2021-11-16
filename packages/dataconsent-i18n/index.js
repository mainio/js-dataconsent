import locales from "./locales";

const DEFAULT_LANGUAGE = "en";

const getLanguage = () => {
  return document.documentElement.getAttribute("lang") || DEFAULT_LANGUAGE;
};

const getTranslations = (locale = null) => {
  const lang = locale || getLanguage();

  return locales[lang] || locales[DEFAULT_LANGUAGE];
}

export default {
  DEFAULT_LANGUAGE,
  getTranslations,
  getLanguage,
};
