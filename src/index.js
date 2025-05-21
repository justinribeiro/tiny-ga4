import { ga4Schema } from './schema/ga4.js';
import { sendBeacon } from './utils/beacon.js';
import {
  isNumber,
  randomInt,
  timestampInSeconds,
  sanitizeValue,
  pageDetails,
} from './utils/helpers.js';

/**
 * @typedef {Object} PayloadData
 * @property {number} protocol_version The GA4 Measurement Protocol version.
 * Always set to 2.
 * @property {string} tracking_id The GA4 Measurement ID (format:
 * G-XXXXXXX) identifying the data stream(s).
 * @property {string} client_id A unique identifier for a user device or browser
 * instance, usually a random client-generated ID.
 * @property {number} session_number The session count for this user (starts at
 * 1, increments per session).
 * @property {number} session_id A unique numeric identifier for the current
 * session (e.g., set to timestamp randomness).
 * @property {number} non_personalized_ads Set to 1 to disable personalized ads
 * (e.g., for GDPR compliance, or because Justin says so).
 * @property {number} hit_count The count of hits (events) sent in this session,
 * starting at 1 and incrementing.
 * @property {Record<string, any>} [additionalProps] Additional dynamic
 * parameters, such as page info or custom fields.
 */

/**
 * @typedef {Object} InternalModel
 * @property {string} version TinyGA4 version
 * @property {string} measurementId The GA4 Measurement ID to send
 * data to (e.g., "G-XXXXXXX"). Justin says only one (my opinion)
 * @property {Record<string, any>} eventParameters Dynamic parameters specific
 * to the current event.
 * @property {Record<string, any>} persistentEventParameters Parameters that
 * persist across multiple events (sticky parameters).
 * @property {Record<string, any>} userProperties User-scoped properties that
 * provide additional user info (Justin says noooone)
 * @property {string} user_agent The user agent string of the client
 * device/browser (I don't use the high entropy since no support on FF/Safari)
 * @property {string} endpoint The URL endpoint for sending GA4 data (usually
 * the GA4 Measurement Protocol endpoint).
 * @property {PayloadData} payloadData Core GA4 payload fields that are sent
 * with every event.
 * @property {Record<string, any>} [additionalProps] Optional additional config
 * overrides or internal state.
 */

/**
 * Initializes a minimal GA4 tracker instance
 *
 * @param {string} measurementId - A Single GA4 measurement ID
 * @param {InternalModel} [config={}] - Optional configuration to override
 * default internal model
 * @param {string} [config.endpoint]
 * @returns {{ version: string, setEventsParameter: (key: string, value: string
 *   | number | Function) => void, trackEvent: (eventName: string,
 *   eventParameters?: Record<string, any>) => void
 * }}
 */
function tinyGa4(measurementId, config = {}) {
  if (!measurementId) {
    throw new Error('TinyGA4 fatal error: missing measurement id!');
  }

  /** @type {InternalModel} */
  const internalModel = {
    version: '1.0.0',
    measurementId: measurementId,
    eventParameters: {},
    persistentEventParameters: {},
    userProperties: {},
    user_agent: navigator.userAgent,
    endpoint: 'https://www.google-analytics.com/g/collect',
    payloadData: {
      protocol_version: 2,
      tracking_id: measurementId,
      client_id: [randomInt(), timestampInSeconds()].join('.'),
      session_number: 1,
      session_id: timestampInSeconds(),
      non_personalized_ads: 1,
      hit_count: 1,
    },
    ...config,
  };

  console.log('[TinyGA4]: Internal Model with Config Built', internalModel);

  /**
   * Persistently set an event parameter to include with all future events
   *
   * @param {string} key
   * @param {string|number|Function} value
   */
  const setEventsParameter = (key, value) => {
    key = sanitizeValue(key, 40);
    value = sanitizeValue(value, 100);
    internalModel.persistentEventParameters[key] = value;
  };

  /**
   * Build a GA4-compliant event payload
   *
   * @param {string} eventName
   * @param {object} customEventParameters
   * @returns {object} payload
   */
  const buildPayload = (eventName, customEventParameters = {}) => {
    const payload = Object.entries(internalModel.payloadData).reduce(
      (acc, [key, value]) => {
        const mappedKey = ga4Schema[key];
        if (mappedKey) {
          acc[mappedKey] = typeof value === 'boolean' ? Number(value) : value;
        }
        return acc;
      },
      {},
    );

    const eventParameters = {
      ...structuredClone(internalModel.persistentEventParameters),
      ...structuredClone(customEventParameters),
      event_name: eventName,
    };

    for (const [key, value] of Object.entries(eventParameters)) {
      const mappedKey = ga4Schema[key];
      if (mappedKey) {
        payload[mappedKey] = typeof value === 'boolean' ? Number(value) : value;
      } else {
        payload[`${isNumber(value) ? 'epn.' : 'ep.'}${key}`] = value;
      }
    }

    console.log('[TinyGA4]: Payload Built!', payload);

    return payload;
  };

  /**
   * Send a GA4 event with given parameters
   *
   * @param {string} eventName - The name of the event
   * @param {object} [eventParameters={}] - Additional parameters specific to
   * this event
   */
  const trackEvent = (eventName, eventParameters = {}) => {
    const pageData = pageDetails();
    if (pageData) {
      console.log('[TinyGA4]: Adding PageData to Internal Model', pageData);
      Object.assign(internalModel.payloadData, pageData);
    }

    const payload = buildPayload(eventName, eventParameters);
    if (!payload) return;

    sendBeacon(internalModel.endpoint, payload, {
      user_agent: internalModel.user_agent,
    });

    internalModel.payloadData.hit_count++;
  };

  return {
    version: internalModel.version,
    setEventsParameter,
    trackEvent,
  };
}

export default tinyGa4;
