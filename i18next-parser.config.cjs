module.exports = {
  // Supported locales
  locales: ['en', 'es'],

  // Default locale
  defaultLocale: 'en',

  // Namespace used by default
  defaultNamespace: 'common',

  defaultValue: '__STRING_NOT_TRANSLATED__',

  // Supported namespaces
  namespaces: [
    'auth', 'calendar', 'dashboard', 'events', 'forms',
    'locale', 'privacy-policy', 'profile', 'resource',
    'settings', 'team-management', 'team-settings', 'teams',
    'common', 'chat'
  ],

  // Input files to scan
  input: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.d.ts',
  ],

  // Output directory
  output: 'src/locales/$LOCALE/$NAMESPACE.json',

  // Indentation
  indentation: 2,

  // Sort keys
  sort: false,

  // Create missing keys
  createMissingKeys: true,

  // Skip default values  
  skipDefaultValues: true,

  // Use namespace separator
  useKeysAsDefaultValue: false,

  // Key separator
  keySeparator: '.',

  // Namespace separator
  namespaceSeparator: ':',

  // Plurals separator
  pluralSeparator: '_',

  // Context separator
  contextSeparator: '_',

  // Functions to look for
  func: {
    list: ['t', 'i18next.t', 'i18n.t'],
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },

  // Trans component configuration
  trans: {
    component: 'Trans',
    i18nKey: 'i18nKey',
    defaultsKey: 'defaults',
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    fallbackKey: false,
  },

  // Debug mode
  verbose: true,
};
