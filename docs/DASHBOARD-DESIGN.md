# Dashboard premium hero

The welcome and motivational panels are enhanced by `css/dashboard-premium.css` and `js/views/dashboard-premium.js`. The background illustration is a bundled SVG at `assets/images/motivation-landscape.svg`, with no network requests.

The greeting remains driven by the existing WeekOS `renderHeader` and saved profile state. The quote rotation is presentation-only and stores only the last quote index in a separate localStorage key to avoid immediate repeats between launches when storage is available. Quotes never modify schedule data. All scripts are classic scripts compatible with `file://`.
