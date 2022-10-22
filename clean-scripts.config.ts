const tsFiles = `"src/**/*.ts"`

export default {
  build: [
    'rimraf dist/',
    {
      back: [
        'tsc -p src/tsconfig.nodejs.json',
        'api-extractor run --local'
      ],
      front: [
        'tsc -p src/tsconfig.browser.json',
        'rollup --config rollup.config.mjs'
      ]
    }
  ],
  lint: {
    ts: `eslint --ext .js,.ts ${tsFiles}`,
    export: `no-unused-export ${tsFiles} --strict --need-module tslib`,
    markdown: `markdownlint README.md`,
    typeCoverage: 'type-coverage -p src/tsconfig.nodejs.json',
    typeCoverageBrowser: 'type-coverage -p src/tsconfig.browser.json'
  },
  test: [
    'ava'
  ],
  fix: `eslint --ext .js,.ts ${tsFiles} --fix`
}
