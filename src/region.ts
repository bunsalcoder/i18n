import regionsToCountry from './resources/regions-to-countries.json';
import countries from './resources/countries.json';

/**
 * Get the time zone setting of the user's device.
 */
export const getTimeZone = () => {
  const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
  return timeZone;
};

/**
 * get current region information such as country name, iso and code
 */
export const getRegion = () => {
  const timeZone = getTimeZone();
  const currentCountry = (regionsToCountry as Record<string, string>)[timeZone];
  const localeCountry = countries.find(
    // (country) => country.country.toLowerCase() === currentCountry.toLowerCase(),
    ({ country }) => country.toLowerCase() === currentCountry.toLowerCase(),
  );
  return localeCountry;
};

/**
 * get all countries information
 */
export const getCountries = () => countries;
