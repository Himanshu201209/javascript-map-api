# JavaScript Google Maps API Integration

Easily embed a customizable Google Map into your website or Webflow project with support for external styles, multiple markers, and flexible configuration via HTML data attributes.

## Features
- **Custom Map Styles**: Load styles from an external JSON file.
- **Multiple Markers**: Add markers via data attributes or separate elements, each with custom icons, sizes, and click URLs.
- **Info Windows**: Display custom HTML content in popups when markers are clicked.
- **Flexible Configuration**: Control map center, zoom, type, controls, and more via HTML attributes.
- **Webflow Friendly**: Designed for easy integration with Webflow custom code.
- **Open Google Maps on Click**: Optionally open Google Maps when clicking on the map.

## Getting Started

### 1. Add the Map Container
Add a `<div>` with `id="map"` to your page. You can configure the map using data attributes:

```html
<div id="map"
     data-lat="51.5074"
     data-lng="-0.1278"
     data-zoom="12"
     data-min-zoom="2"
     data-max-zoom="18"
     data-api-key="YOUR_GOOGLE_MAPS_API_KEY"
     data-styles-url="https://example.com/map-styles.json"
     data-map-type="roadmap"
     data-show-controls="true"
     data-scroll-zoom="true"
     data-open-google-maps="false"
     data-marker-icon="https://example.com/default-marker.png"
     data-marker-width="40"
     data-marker-height="40"
     data-marker-1="51.5074, -0.1278, London"
     data-marker-1-icon="https://example.com/london-marker.png"
     data-marker-1-width="50"
     data-marker-1-height="50"
     data-marker-1-url="https://example.com/london"
     data-marker-1-info="<h3>London</h3><p>The capital of England</p>"
     data-marker-2="40.7128, -74.0060, New York"
     data-marker-2-info="<h3>New York</h3><p>The Big Apple</p>"
     data-marker-3="34.0522, -118.2437, Los Angeles"
     data-marker-3-icon="https://example.com/la-marker.png"
     style="height: 500px; width: 100%;">
</div>
```

### 2. Add the Script
Include the script in your page using one of these methods:

#### Local file:
```html
<script src="map-embed.js"></script>
```

#### Minified version (local):
```html
<script src="map-embed.min.js"></script>
```

#### CDN (for Webflow):
```html
<script src="https://cdn.jsdelivr.net/gh/Himanshu201209/javascript-map-api@main/map-embed.js"></script>
```

#### Minified version (CDN):
```html
<script src="https://cdn.jsdelivr.net/gh/Himanshu201209/javascript-map-api@main/map-embed.min.js"></script>
```

### 3. (Optional) Add Markers via Elements
You can also add markers using separate elements (legacy approach):

```html
<div data-marker data-lat="51.5074" data-lng="-0.1278" data-title="London" data-icon="https://example.com/london-marker.png" data-width="50" data-height="50" data-url="https://example.com/london" data-info="<h3>London</h3><p>Click for more info</p>"></div>
```

## Data Attribute Reference
- `data-lat`, `data-lng`: Center coordinates
- `data-zoom`: Initial zoom level
- `data-min-zoom`, `data-max-zoom`: Zoom limits
- `data-api-key`: Google Maps API key (required)
- `data-styles-url`: URL to custom map styles JSON
- `data-map-type`: `roadmap`, `satellite`, `hybrid`, `terrain`
- `data-show-controls`: Show/hide map controls (`true`/`false`)
- `data-scroll-zoom`: Enable/disable scroll wheel zoom (`true`/`false`)
- `data-open-google-maps`: Open Google Maps on click (`true`/`false`)
- `data-marker-icon`, `data-marker-width`, `data-marker-height`: Global marker icon and size
- `data-marker-N`: Marker location in format `"lat, lng, title"`
- `data-marker-N-icon`, `data-marker-N-width`, `data-marker-N-height`: Per-marker icon settings
- `data-marker-N-url`: URL to open when marker is clicked
- `data-marker-N-info`: HTML content for info window popup

## Example
```html
<div id="map"
     data-lat="40.7128"
     data-lng="-74.0060"
     data-zoom="10"
     data-marker-1="40.7128, -74.0060, New York"
     data-marker-1-info="<h3>New York City</h3><p>The city that never sleeps</p>"
     data-marker-2="34.0522, -118.2437, Los Angeles"
     style="height: 400px; width: 100%;">
</div>
<script src="map-embed.js"></script>
```

## Info Windows
You can add custom HTML content to display in popups when markers are clicked:

- Use the `data-marker-N-info` attribute to specify HTML content
- HTML tags are supported (headings, paragraphs, links, etc.)
- Only one info window will be open at a time
- If both `data-marker-N-info` and `data-marker-N-url` are specified, clicking the marker will open the info window and then navigate to the URL after a short delay

## Custom Map Styles
You can use a custom map style by providing a URL to a JSON file (e.g., from [Snazzy Maps](https://snazzymaps.com/)).

## Notes
- **API Key Security**: For production use, restrict your API key in the Google Cloud Console to prevent unauthorized use.
- The map will initialize automatically on page load.
- For Webflow, add the script in the custom code section of the page settings (in the `<head>` tag) and add the map container in your page design.
- You can modify the default settings in the CONFIG object at the top of the script.

## License
MIT
