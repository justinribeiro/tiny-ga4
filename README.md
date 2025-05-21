# tiny-ga4

> Justin's (Very) Opinionated Google Analytics 4 Measurement Protocol Library, a fork of David's [ga4mp](https://github.com/analytics-debugger/ga4mp).

## The Differences / Features

- Still no dependencies; it's just a vanilla ES module.
- Tiny tiny for the browser only; just 1.66KB Gzip'ed on the wire (98% smaller than GA4's version).
- More type defs, updated to some new browser APIs for speed (e.g., structuredClone)
- No user tracking (IP address or otherwise); I gutted it (my opinion)

## Why?

To be clear, David's [ga4mp](https://github.com/analytics-debugger/ga4mp) works absolutely fine. I gutted this to find more bytes to save, ditch any user tracking whatsoever, and speed up a few very minor things. His version is more flexible than this.

## Install via package manager

This library is built as an ES module and available on NPM:

To install, use your package manager of choice:

```sh
npm i @justinribeiro/tiny-ga4
# or
yarn add @justinribeiro/tiny-ga4
```

## Basic Usage

```js
import analytics from '@justinribeiro/tiny-ga4';
window.analytics = analytics('G-YOUR_TRACKING_ID');
window.analytics.trackEvent('page_view');
```

## Production Ready Usage

If you don't want to use your own build, there is a prebuilt `tiny-ga4.esm.min.js` that is available:

```js
import analytics from '@justinribeiro/tiny-ga4/tiny-ga4.esm.min.js';
window.analytics = analytics('G-YOUR_TRACKING_ID');
window.analytics.trackEvent('page_view');
```

## CDN Usage

You can also use directly from the CDN (should you so please):

```html
<script type="module">
import analytics from 'https://cdn.jsdelivr.net/npm/@justinribeiro/tiny-ga4e@1/tiny-ga4.esm.min.js';
window.analytics = analytics('G-YOUR_TRACKING_ID');
window.analytics.trackEvent('page_view');
</script>
```

## The (Original) Backstory

> From David's [ga4mp](https://github.com/analytics-debugger/ga4mp) original README

This is an open-source implementation for the *client-side* protocol used by **Google Analytics 4**. When I mention "**client-side**" is because it must be differentiated with the official [GA4 Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/ga4) offered by Google.

This library implements the public **Google Analytics 4** protocol to make possible to do a full server-side tracking using NODE/JS which is not actually possible with the official **Measurement Protocol** , which is meant only to augment the current GA4 data and it's not ready for doing a full tracking.

Main differences with the official offers server-side protocol are:

- Trigger new sessions and visits starts
- Track Sessions attribution
- Override the User IP to populate the GEO Details
- View the hits on the DebugView
- Override ANY value you want
- Easily portable to other languages
- Privacy Compliant: Full control over which cookies are created/read and sent to Google
