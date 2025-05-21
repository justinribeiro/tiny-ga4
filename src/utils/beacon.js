/**
 * Send analytics payload to the GA4 endpoint using navigator.sendBeacon.
 *
 * @param {string} endpoint - The endpoint URL to send data to
 * @param {Record<string, any>} payload - The payload object to serialize as query params
 */
export const sendBeacon = (endpoint, payload) => {
  if (!endpoint || typeof endpoint !== 'string') {
    throw new Error('Invalid endpoint URL');
  }

  // Convert payload values to strings since URLSearchParams expects string values
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(payload)) {
    params.append(key, value == null ? '' : String(value));
  }

  navigator.sendBeacon(`${endpoint}?${params.toString()}`);
  console.log('[TinyGA4]: Beacon Sent!', endpoint, params.toString());
};
