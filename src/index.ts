import { useState, useEffect } from "react";

const LOCALE_KEY = "locale";
const LOCALE_PHRASE_KEY = "localePhrases";

declare global {
  interface Window {
    translate: any;
  }
}

const localeEscape = (str: string, obj: Record<string, any> = {}): string => {
  const keys = Object.keys(obj);
  return keys.reduce((carry, placeholder) => {
    const nextResult = carry.replace(`{${placeholder}}`, obj[placeholder]);
    return nextResult;
  }, str);
};

const translateFnc = (
  i18n: any,
  key: string,
  replace: Record<string, any> = {}
) => {
  const translation: any =
    i18n[key.toLowerCase()] ||
    key.split(".").reduce((t, i) => t[i.toLowerCase()] || key, i18n);
  const translated = localeEscape(translation || key, replace);
  return translated;
};

const getLocalePhrases = (): Record<string, string> => {
  const phrases = localStorage.getItem(LOCALE_PHRASE_KEY) || "{}";
  try {
    const decodedPhrases = JSON.parse(phrases);
    return decodedPhrases;
  } catch {
    return {};
  }
};

const hasPhrases = (): boolean =>
  !!localStorage.getItem(LOCALE_PHRASE_KEY) || false;

const registerLocale = (locale: string, phrases: Record<string, string>) => {
  localStorage.setItem(LOCALE_KEY, locale);
  localStorage.setItem(LOCALE_PHRASE_KEY, JSON.stringify(phrases));
};

export const getLocale = (): string => {
  const locale =
    localStorage.getItem(LOCALE_KEY) || navigator.language || false;
  return locale.toString();
};

export type I18nProps = {
  defaultLocale?: string;
  getUrl: (code: string) => string | [string, Record<string, any>];
  fetcher: any;
  storage?: "ram" | "local-storage";
};

/**
 * The i18n hook
 * @param {I18nProps} props: The I18n propertiers
 * @return [translator, locale, setLocale]
 */
export default function useI18n(props: I18nProps) {
  const { defaultLocale, fetcher, getUrl } = props;
  const [message, setMessage] = useState({
    locale: defaultLocale,
    i18n: {},
  });

  const { locale, i18n } = message;

  /**
   * Set the new locale/language. It check if the current
   * language the same as the one being set, it will ignore
   * excep we force it.
   * @param {string} lcoaleCdoe - The language code (en-US)
   * @param {boolean} force - If we need to force to get updated
   */
  const setLocale = (lang: string, force: boolean = false) => {
    if (lang === getLocale() && !force) return false;
    const theUrl = getUrl(lang);
    const [url, reqProps] = Array.isArray(theUrl) ? theUrl : [theUrl, {}];
    if (!url) {
      registerLocale(lang, {});
      setMessage(() => ({
        locale: lang,
        i18n: {},
      }));
      return true;
    }

    return fetcher(url, reqProps)
      .catch(() => ({}))
      .then((json: any) => {
        registerLocale(lang, json);
        setMessage(() => ({
          locale: lang,
          i18n: json,
        }));
      });
  };

  useEffect(() => {
    const currentLocale = locale || "en-US";
    if (!hasPhrases()) setLocale(currentLocale, true);
    else {
      setMessage(() => ({
        locale: currentLocale,
        i18n: getLocalePhrases(),
      }));
    }
  }, []);

  const translator = translateFnc.bind(null, i18n);
  window.translate = translator;

  return [translator, locale, setLocale];
}
