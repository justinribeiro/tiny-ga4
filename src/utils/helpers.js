/**
 * Trim a string to a max length; returns original if not a string.
 * @param {string|any} str
 * @param {number} chars
 * @returns {string|any}
 */
export const trim = (str, chars) =>
  typeof str === 'string' ? str.substring(0, chars) : str;

/**
 * Check if value is a valid number (not NaN).
 * @param {any} val
 * @returns {boolean}
 */
export const isNumber = val => typeof val === 'number' && !Number.isNaN(val);

/**
 * Check if value is a plain object (not null or array).
 * @param {any} val
 * @returns {boolean}
 */
export const isObject = val =>
  val !== null && typeof val === 'object' && !Array.isArray(val);

/**
 * Check if value is a non-null string.
 * @param {any} val
 * @returns {boolean}
 */
export const isString = val => typeof val === 'string' && val !== null;

/**
 * Generate a random 32-bit integer (0 to 2,147,483,647).
 * @returns {number}
 */
export const randomInt = () => Math.floor(Math.random() * 2_147_483_648);

/**
 * Get current Unix timestamp in seconds.
 * @returns {number}
 */
export const timestampInSeconds = () => Math.floor(Date.now() / 1000);

/**
 * Get page details useful for analytics.
 * @returns {{
 *   page_location: string,
 *   page_referrer: string,
 *   page_title: string,
 *   language: string,
 *   screen_resolution: string
 * }}
 */
export const pageDetails = () => ({
  page_location: document.location.href,
  page_referrer: document.referrer,
  page_title: document.title,
  language: (
    navigator?.language ||
    navigator?.browserLanguage ||
    ''
  ).toLowerCase(),
  screen_resolution: `${window.screen?.width ?? 0}x${window.screen?.height ?? 0}`,
});

/**
 * Sanitize value to a string trimmed to maxLength for GA4 limits.
 * Returns original if input is invalid.
 * @param {any} val
 * @param {number} maxLength
 * @returns {string|any}
 */
export const sanitizeValue = (val, maxLength) => {
  try {
    val = val?.toString() ?? '';
  } catch {
    return val;
  }

  if (!isString(val) || !isNumber(maxLength) || maxLength <= 0) return val;
  return trim(val, maxLength);
};
