const forAnyJSFiles = {
  parser: '@babel/eslint-parser',
  parserOptions: {
    sourceType: 'module',
    allowImportExportEverywhere: false,
    requireConfigFile: false,
    ecmaVersion: 2020,
    ecmaFeatures: {
      globalReturn: false,
      jsx: true,
    },
    parser: 'babel-eslint',
  },
  files: ['**/*.js', '**/*.jsx'],
  extends: [
    'airbnb',
    'airbnb/hooks',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'no-console': [
      'error',
      { allow: Object.keys(console).filter((item) => item !== 'log') },
    ],
    'no-nonoctal-decimal-escape': 'off',
    'no-unused-expressions': ['error', { allowShortCircuit: true }],
    'import/prefer-default-export': 'off',
    'arrow-parens': 'off',
  },
};

const forTSFiles = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
  },
  files: ['**/*.ts', '**/*.tsx'],
  settings: {
    react: {
      version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
    },
  },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. '@typescript-eslint/explicit-function-return-type': 'off',

    // fixes extends on
    'import/no-extraneous-dependencies': 'off',
    'import/no-import-module-exports': 'off',
    'import/no-relative-packages': 'off',
    'no-use-before-define': 'off',
    'no-nonoctal-decimal-escape': 'off',
    '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
    // fixes extends off

    'import/no-unused-modules': 'off', // enable for only modules  ['error', { unusedExports: true }],
    'import/extensions': [
      'error',
      'never',
      { svg: 'always', woff: 'always', style: 'always', json: 'always' },
    ],
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'import/no-cycle': ['warn'],

    'no-console': [
      'error',
      { allow: Object.keys(console).filter((item) => item !== 'log') },
    ],
    'no-unused-vars': 'off',
    'no-continue': 'off',
    'no-unused-expressions': 'off',

    '@typescript-eslint/no-unused-expressions': [
      'error',
      { allowShortCircuit: true },
    ],
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/comma-dangle': 'off',
    '@typescript-eslint/no-explicit-any': 'off', // TODO think this

    'function-component-definition': 'off',

    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'prefer-destructuring': ['error', { object: true, array: false }],
    'object-shorthand': ['error'],

    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/anchor-is-valid': ['warn'],
    'jsx-a11y/alt-text': 'off',

    'react/jsx-filename-extension': [1, { extensions: ['.jsx', '.tsx'] }],
    'react/jsx-indent': [0, 'tab'],
    'react/prop-types': [0, {}],
    'react/display-name': 'off',
    'react/require-default-props': 'off',
    'react/jsx-boolean-value': 'off',
    'react/default-props-match-prop-types': 'off',
    'react/function-component-definition': 'off',
    'react/no-unstable-nested-components': ['warn', { allowAsProps: true }],
  },
};

const rules = {
  root: true,
  overrides: [forAnyJSFiles, forTSFiles],
};

module.exports = rules;
