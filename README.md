# Front-end data consent tool for websites

This package provides tooling for managing data consents e.g. for complying with
GDPR / e-Privacy directive.

This consists of the following packages:

- **@mainiotech/dataconsent-core** - The core tools to build the data consent
  banners and dialogs and to manage the user interaction with them.
- **@mainiotech/dataconsent-serviceregistry** - The service registry which
  provides information about cookies used by different services and explanations
  for those cookies.
- **@mainiotech/dataconsent-i18n** - Translations for building the user
  interface for the consent banner and dialog.
- **@mainiotech/dataconsent-bootstrap** - Bootstrap v5 implementation of the
  user interface, i.e. a complete implementation.

## Usage

This is mainly used for internal purposes at Mainio Tech right now, so
unfortunately the is no documentation or guidance on how to use this right now.

The code is free (as in freedom), so feel free to poke it and use it for your
own purposes.

### Example: Boostrap v5

Install:

```
$ npm i @mainiotech/dataconsent-bootstrap @mainiotech/dataconsent-serviceregistry
```

Use:

```
import ConsentManager from "@mainiotech/dataconsent-bootstrap";
import i18n from "@mainiotech/dataconsent-i18n";
import { services } from "@mainiotech/dataconsent-core";
import getServices from "@mainiotech/dataconsent-serviceregistry";

const locale = i18n.getLanguage();

const cm = new ConsentManager({
  categories: services(
    getServices(locale),
    i18n.getTranslations(),
    ["googleanalytics"]
  ),
});
document.documentElement.dataset.cm = cm;
```

Make sure you have the `lang` attribute defined in your document's `<html>` tag
in order for the translations to work correctly.
