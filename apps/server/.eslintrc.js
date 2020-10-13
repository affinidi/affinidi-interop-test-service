module.exports = {
  env: {
    jest: true,
    node: true,
    jasmine: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: './'
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'standard'
  ],
  plugins: [
    '@typescript-eslint'
  ],
  rules: {
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    "@typescript-eslint/no-unused-vars": 'off',
    '@typescript-eslint/member-delimiter-style': ['error', {
      multiline: {
        delimiter: 'none',
        requireLast: false
      },
      singleline: {
        delimiter: 'comma',
        requireLast: false
      }
    }],
    '@typescript-eslint/indent': 'off',    
    '@typescript-eslint/no-var-requires': 0,
    'no-unused-vars': 'off',
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/ban-types": 'off',
    'node/no-unsupported-features/es-syntax': 'off',
    'key-spacing': ['error', {
      beforeColon: false,
      mode: 'minimum',
      align: 'value'
    }],
    'id-match': ['error', '^[a-zA-Z_]*$'],
    'no-multi-spaces': ['error', {
      exceptions: {
        ImportDeclaration: true,
        VariableDeclarator: true,
        Property: true
      }
    }]
  }
};
