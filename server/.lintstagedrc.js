// @ts-check

/**
 * lint-staged/prettier has an issue with special characters in filenames,
 * like the ones uses for nextjs dynamic routes (ie: [id].tsx...)
 * @link https://github.com/okonet/lint-staged/issues/676
 */
const escape = require('shell-quote').quote;
const { ESLint } = require('eslint');

const eslint = new ESLint();
const isWin = process.platform === 'win32';

/**
 * @param {string[]} files
 */
function pretty(files) {
  return `prettier --with-node-modules --ignore-path .prettierignore --write ${files
    .map((f) => `"${isWin ? f : escape([f])}"`)
    .join(' ')}`;
}

/**
 * @param {string[]} files
 */
function lint(files) {
  return `eslint --no-ignore --max-warnings=0 --fix ${files
    .filter((f) => !eslint.isPathIgnored(f))
    .map((f) => `"${f}"`)
    .join(' ')}`;
}

/**
 * @param {string[]} files
 */
// function styleLint(files) {
//   return `stylelint --max-warnings=0 --fix ${files.map((f) => `"${f}"`).join(' ')}`;
// }

module.exports = {
  /**
   * @param {string[]} files
   */
  '**/*.{ts,tsx,js,jsx}': (files) => [pretty(files), lint(files)],
  /**
   * @param {string[]} files
   */
  '**/*.{json,md,mdx,html,yml,yaml}': (files) => pretty(files),
  /**
   * @param {string[]} files
   */
  // '**/*.{html,css,less,scss,sass,tsx,jsx}': (files) => [pretty(files), styleLint(files)],
};
