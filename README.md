# Google Maps Integration for Webflow

This script allows you to easily add a customized Google Map to your Webflow site with custom markers and styling.

## Features

- Custom map styling via JSON file
- Advanced markers with custom icons
- Multiple ways to add markers
- Responsive design
- Configurable controls and interactions
- URL linking for markers
- Compatible with Webflow

## Setup Instructions

1. Add a div with id="map" to your Webflow page:
   ```html
   <div id="map" style="height: 500px; width: 100%;"></div>
   ```

2. Add this script to your site's custom code section in the head:
   ```html
   <script src="https://cdn.jsdelivr.net/gh/hlabsdev1/javascript-map-api@main/map-embed.js"></script>
   ```

3. Configure the map using data attributes:
   ```html
   <div id="map" 
        data-lat="51.5074" 
        data-lng="-0.1278" 
        data-zoom="12"
        data-api-key="YOUR_GOOGLE_MAPS_API_KEY"
        style="height: 500px; width: 100%;">
   </div>
   ```

## Map Styling Options

### JSON Styling vs. Cloud-Based Styling

There are two ways to style your map:

1. **JSON Styling (Default)**: Uses a JSON file to define styles
   - Set `data-styles-url` to your JSON file URL
   - Leave `data-map-id` empty or remove it
   - Example: `data-styles-url="https://example.com/map-styles.json"`

2. **Cloud-Based Styling**: Uses Google Cloud Console to define styles
   - Create a style in Google Cloud Console
   - Create a Map ID and associate it with your style
   - Set `data-map-id` to your Map ID
   - Example: `data-map-id="YOUR_MAP_ID"`

**Important**: JSON styling and Map ID are mutually exclusive. You must choose one approach.

## Configuration Options

| Attribute | Description | Default |
|-----------|-------------|---------|
| data-lat | Center latitude | 51.5074 |
| data-lng | Center longitude | -0.1278 |
| data-zoom | Zoom level | 10 |
| data-min-zoom | Minimum zoom level | 2 |
| data-max-zoom | Maximum zoom level | 18 |
| data-api-key | Google Maps API key | (required) |
| data-styles-url | URL to JSON styles file | https://cdn.jsdelivr.net/gh/hlabsdev1/cavandish@main/map.json |
| data-map-id | Google Cloud Map ID | (empty) |
| data-map-type | Map type (roadmap, satellite, hybrid, terrain) | roadmap |
| data-show-controls | Show map controls | true |
| data-scroll-zoom | Enable scroll wheel zoom | true |
| data-open-google-maps | Open Google Maps when clicking on the map | false |
| data-marker-icon | Default marker icon URL | (Google default) |
| data-marker-width | Default marker icon width | 40 |
| data-marker-height | Default marker icon height | 40 |

## Adding Markers

### Method 1: Using data attributes on the map element

```html
<div id="map" 
     data-marker-1="51.5074, -0.1278, London"
     data-marker-1-icon="https://example.com/london-marker.png"
     data-marker-1-url="https://example.com/london"
     data-marker-2="40.7128, -74.0060, New York"
     style="height: 500px; width: 100%;">
</div>
```

### Method 2: Using separate marker elements

```html
<div id="map" style="height: 500px; width: 100%;"></div>
<div data-marker data-lat="51.5074" data-lng="-0.1278" data-title="London" data-icon="https://example.com/london-marker.png"></div>
<div data-marker data-lat="40.7128" data-lng="-74.0060" data-title="New York"></div>
```

## Advanced Usage

### Custom Map Styling

The script uses Google's Advanced Markers by default. For custom styling:

1. Create a JSON file with your map styles (use [Google's Styling Wizard](https://mapstyle.withgoogle.com/))
2. Host the JSON file (e.g., on GitHub)
3. Set the `data-styles-url` attribute to your JSON file URL

### Cloud-Based Styling

1. Create a style in [Google Cloud Console](https://console.cloud.google.com/google/maps-apis/studio)
2. Create a Map ID and associate it with your style
3. Set the `data-map-id` attribute to your Map ID

## Troubleshooting

- If markers don't appear, check the console for errors
- If styles don't apply, ensure your JSON file is accessible and properly formatted
- If using a Map ID, ensure you've created a style in Google Cloud Console and associated it with your Map ID
- JSON styling doesn't work with Map ID - you must choose one approach

## License

MIT License
