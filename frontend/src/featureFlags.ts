// Simple feature flag helper reading Vite env variables
export const featureFlags = {
  darkMode: import.meta.env.VITE_FEATURE_DARK_MODE === 'true',
  // add more flags here, e.g.:
  // newSearch: import.meta.env.VITE_FEATURE_NEW_SEARCH === 'true',
};