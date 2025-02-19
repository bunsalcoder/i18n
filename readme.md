# I18n

International Localization, the React Hook which handle the request
and local storage to manage the language setting. The default
is by browser. It uses the existing common service located under
the ``https://apps.initcapp.com/i18n/api``.

```ts
const [translate, locale, setLocale] = useI18n(localeProps);
```

## How to use

To use ``i18n``, we need to identify what language are available, which
url represent the locale code. The following example is to configure
the ``i18n`` injected into the **context** to make sure the usage of
the ``i18n`` is available application wide.

```tsx
import React, { createContext } from 'react';
import useI18n from '@core/i18n'
import ajax from '@core/ajax';

const context = createContext({});

const APP_ID = 'myapp-to-use-i18n';
const I18N_URL = `https://apps.initcapps.com/i18n/api/apps/${APP_ID}`;
cosnt getUrl = (lang: string): string => `${I18N_URL}/${lang}`;

export const ContextProvider = (props: any) => {
  const { children } = props;
  const { Provider } = context;
  const [translate, locale, setLocale] => useI18n({ 
    gerUrl,
    fetcher: ajax,
  });
  const value = {
    translate,
    locale,
    setLocale,
  };
  return (<Provider value={value}>{children}</Provider>);
};
```

## ``getUrl`` Props

The ``getUrl`` property is the callback function to triggered
when making the request to get the localization content. This
callback will return the ``string`` or ``[string, fetchProps]``.
The following example will return the extra information before
making the request to get the localization content:

```ts
import useI18n fro '@core/i18n';

const getUrl = (lang: string): [string, Record<string, any>] => ([
  `https://i18n.com/api/apps/test-app/${lang}`,
  query: { tmp: Math.ranodm() },
  headers: { 'x-lang': lang },
]);
```
