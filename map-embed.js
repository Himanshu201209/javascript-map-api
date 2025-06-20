// Custom Google Map with Styles from External JSON
(function() {
    // Configuration - EDIT THESE VALUES
    const CONFIG = {
        apiKey: 'AIzaSyA_fUqhxvP_ZU57ns47VEgkyp3BqHRbxhA', // Your Google Maps API key
        mapElementId: 'map',                              // ID of the div element for the map
        centerLat: 51.5074,                               // Default center latitude (London)
        centerLng: -0.1278,                               // Default center longitude (London)
        zoom: 10,                                         // Default zoom level
        minZoom: 2,                                       // Default minimum zoom level
        maxZoom: 18,                                      // Default maximum zoom level
        stylesUrl: 'https://cdn.jsdelivr.net/gh/hlabsdev1/cavandish@main/map.json', // URL to the map styles JSON
        defaultMarkerIcon: null,                          // Default marker icon (null = Google default)
        markerIconWidth: 40,                              // Default marker icon width in pixels
        markerIconHeight: 40,                             // Default marker icon height in pixels
        mapType: 'roadmap',                               // Default map type (roadmap, satellite, hybrid, terrain)
        showControls: true,                               // Show map controls
        allowScrollZoom: true,                            // Allow zoom with mouse wheel
        openGoogleMaps: false,                            // Open Google Maps when clicking on the map
        // Markers are now read from HTML data attributes
    };

    // Store info windows globally to ensure only one is open at a time
    let activeInfoWindow = null;
    
    // Custom styles for info windows
    const infoWindowStyles = `
        .gm-ui-hover-effect {
            height: 30px;
            width: 48px;
            top: 0px !important;
            right: 0px !important;
        }
    `;

    // Initialize the map when the DOM is fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Find the map element
        const mapElement = document.getElementById(CONFIG.mapElementId);
        if (!mapElement) {
            console.error(`Map element with ID '${CONFIG.mapElementId}' not found`);
            return;
        }

        // Get map settings from data attributes if available
        const centerLat = parseFloat(mapElement.getAttribute('data-lat') || CONFIG.centerLat);
        const centerLng = parseFloat(mapElement.getAttribute('data-lng') || CONFIG.centerLng);
        const zoom = parseInt(mapElement.getAttribute('data-zoom') || CONFIG.zoom);
        const minZoom = parseInt(mapElement.getAttribute('data-min-zoom') || CONFIG.minZoom);
        const maxZoom = parseInt(mapElement.getAttribute('data-max-zoom') || CONFIG.maxZoom);
        const stylesUrl = mapElement.getAttribute('data-styles-url') || CONFIG.stylesUrl;
        const defaultMarkerIcon = mapElement.getAttribute('data-marker-icon') || CONFIG.defaultMarkerIcon;
        const markerIconWidth = parseInt(mapElement.getAttribute('data-marker-width') || CONFIG.markerIconWidth);
        const markerIconHeight = parseInt(mapElement.getAttribute('data-marker-height') || CONFIG.markerIconHeight);
        
        // Get API key from attribute if available, otherwise use the default
        const apiKey = mapElement.getAttribute('data-api-key') || CONFIG.apiKey;
        
        // Get additional map settings
        const mapType = (mapElement.getAttribute('data-map-type') || CONFIG.mapType).toLowerCase();
        const showControls = mapElement.hasAttribute('data-show-controls') ? 
            mapElement.getAttribute('data-show-controls') !== 'false' : CONFIG.showControls;
        const allowScrollZoom = mapElement.hasAttribute('data-scroll-zoom') ? 
            mapElement.getAttribute('data-scroll-zoom') !== 'false' : CONFIG.allowScrollZoom;
        const openGoogleMaps = mapElement.hasAttribute('data-open-google-maps') ? 
            mapElement.getAttribute('data-open-google-maps') === 'true' : CONFIG.openGoogleMaps;

        // Add custom styles to the document
        addCustomStyles();

        // Initialize the map
        initCustomMap(
            apiKey, 
            CONFIG.mapElementId, 
            centerLat, 
            centerLng, 
            zoom, 
            minZoom,
            maxZoom,
            stylesUrl,
            defaultMarkerIcon,
            markerIconWidth,
            markerIconHeight,
            mapType,
            showControls,
            allowScrollZoom,
            openGoogleMaps
        );
    });
    
    // Function to add custom styles to the document
    function addCustomStyles() {
        const styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.appendChild(document.createTextNode(infoWindowStyles));
        document.head.appendChild(styleElement);
    }

    // Main function to initialize the map
    function initCustomMap(
        apiKey, 
        mapElementId = 'map', 
        centerLat = 51.5074, 
        centerLng = -0.1278, 
        zoom = 10,
        minZoom = 2,
        maxZoom = 18,
        stylesUrl = 'https://cdn.jsdelivr.net/gh/hlabsdev1/cavandish@main/map.json',
        defaultMarkerIcon = null,
        markerIconWidth = 40,
        markerIconHeight = 40,
        mapType = 'roadmap',
        showControls = true,
        allowScrollZoom = true,
        openGoogleMaps = false
    ) {
        // Create script element for Google Maps API
        const googleMapsScript = document.createElement('script');
        googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=renderMap`;
        googleMapsScript.async = true;
        googleMapsScript.defer = true;
        
        // Define the renderMap function that will be called when Google Maps API is loaded
        window.renderMap = function() {
            // Map center coordinates
            const center = { lat: centerLat, lng: centerLng };
            
            // Get the map container element
            const mapElement = document.getElementById(mapElementId);
            
            if (!mapElement) {
                console.error(`Map element with ID '${mapElementId}' not found`);
                return;
            }
            
            // Convert mapType string to Google Maps constant
            let mapTypeId = google.maps.MapTypeId.ROADMAP;
            switch (mapType.toLowerCase()) {
                case 'satellite':
                    mapTypeId = google.maps.MapTypeId.SATELLITE;
                    break;
                case 'hybrid':
                    mapTypeId = google.maps.MapTypeId.HYBRID;
                    break;
                case 'terrain':
                    mapTypeId = google.maps.MapTypeId.TERRAIN;
                    break;
                default:
                    mapTypeId = google.maps.MapTypeId.ROADMAP;
            }
            
            // Create map instance
            const map = new google.maps.Map(mapElement, {
                zoom: zoom,
                center: center,
                mapTypeId: mapTypeId,
                mapTypeControl: showControls,
                streetViewControl: showControls,
                zoomControl: showControls,
                fullscreenControl: showControls,
                scrollwheel: allowScrollZoom,
                gestureHandling: allowScrollZoom ? 'auto' : 'none',
                minZoom: minZoom,
                maxZoom: maxZoom
            });
            
            // Fetch and apply the custom styles from the external JSON if a URL is provided
            if (stylesUrl) {
                fetch(stylesUrl)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to fetch map styles');
                        }
                        return response.json();
                    })
                    .then(styles => {
                        if (styles && Array.isArray(styles)) {
                            map.setOptions({ styles: styles });
                        } else {
                            console.warn('Invalid map styles format:', styles);
                        }
                    })
                    .catch(error => {
                        console.error('Error loading map styles:', error);
                        // Continue with default Google styling
                    });
            }
                
            // Store map instance and default marker icon in window object
            window.customGoogleMap = map;
            window.defaultMarkerIcon = defaultMarkerIcon;
            window.markerIconWidth = markerIconWidth;
            window.markerIconHeight = markerIconHeight;
            
            // Find and add markers
            findAndAddMarkers();
            
            // Add click handler to open Google Maps if enabled
            if (openGoogleMaps) {
                map.addListener('click', function(event) {
                    const lat = event.latLng.lat();
                    const lng = event.latLng.lng();
                    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
                });
            }
            
            // Return map instance
            return map;
        };
        
        // Add the script to the document
        document.head.appendChild(googleMapsScript);
    }

    // Function to find marker elements and add them to the map
    function findAndAddMarkers() {
        if (!window.customGoogleMap) {
            console.error('Map not initialized yet');
            return;
        }

        const mapElement = document.getElementById(CONFIG.mapElementId);
        if (!mapElement) return;
        
        // Method 1: Find all elements with data-marker attribute (legacy support)
        const markerElements = document.querySelectorAll('[data-marker]');
        markerElements.forEach(element => {
            const lat = parseFloat(element.getAttribute('data-lat'));
            const lng = parseFloat(element.getAttribute('data-lng'));
            const title = element.getAttribute('data-title') || '';
            const icon = element.getAttribute('data-icon') || window.defaultMarkerIcon;
            const width = parseInt(element.getAttribute('data-width') || window.markerIconWidth);
            const height = parseInt(element.getAttribute('data-height') || window.markerIconHeight);
            const url = element.getAttribute('data-url') || '';
            const infoContent = element.getAttribute('data-info') || '';
            
            if (isNaN(lat) || isNaN(lng)) {
                console.error('Invalid marker coordinates:', element);
                return;
            }
            
            addMarker(lat, lng, title, icon, width, height, url, infoContent);
        });
        
        // Method 2: Check for data-marker-N attributes on the map element itself
        const attributes = mapElement.attributes;
        const markerPattern = /^data-marker-(\d+)$/;
        const markerIconPattern = /^data-marker-(\d+)-icon$/;
        const markerWidthPattern = /^data-marker-(\d+)-width$/;
        const markerHeightPattern = /^data-marker-(\d+)-height$/;
        const markerUrlPattern = /^data-marker-(\d+)-url$/;
        const markerInfoPattern = /^data-marker-(\d+)-info$/;
        
        // First, collect all marker data and icon data
        const markersData = {};
        
        for (let i = 0; i < attributes.length; i++) {
            const attr = attributes[i];
            
            // Check for marker data
            let match = attr.name.match(markerPattern);
            if (match && !attr.name.endsWith('-icon') && !attr.name.endsWith('-width') && !attr.name.endsWith('-height') && !attr.name.endsWith('-url') && !attr.name.endsWith('-info')) {
                const markerIndex = match[1];
                const markerValue = attr.value;
                const parts = markerValue.split(',').map(part => part.trim());
                
                if (parts.length >= 2) {
                    const lat = parseFloat(parts[0]);
                    const lng = parseFloat(parts[1]);
                    const title = parts[2] || '';
                    
                    if (!isNaN(lat) && !isNaN(lng)) {
                        if (!markersData[markerIndex]) {
                            markersData[markerIndex] = {};
                        }
                        markersData[markerIndex].lat = lat;
                        markersData[markerIndex].lng = lng;
                        markersData[markerIndex].title = title;
                    } else {
                        console.error(`Invalid marker format for ${attr.name}: ${markerValue}`);
                    }
                } else {
                    console.error(`Invalid marker format for ${attr.name}: ${markerValue}`);
                }
            }
            
            // Check for marker icon data
            match = attr.name.match(markerIconPattern);
            if (match) {
                const markerIndex = match[1];
                const iconUrl = attr.value;
                
                if (!markersData[markerIndex]) {
                    markersData[markerIndex] = {};
                }
                markersData[markerIndex].icon = iconUrl;
            }
            
            // Check for marker width
            match = attr.name.match(markerWidthPattern);
            if (match) {
                const markerIndex = match[1];
                const width = parseInt(attr.value);
                
                if (!markersData[markerIndex]) {
                    markersData[markerIndex] = {};
                }
                markersData[markerIndex].width = width;
            }
            
            // Check for marker height
            match = attr.name.match(markerHeightPattern);
            if (match) {
                const markerIndex = match[1];
                const height = parseInt(attr.value);
                
                if (!markersData[markerIndex]) {
                    markersData[markerIndex] = {};
                }
                markersData[markerIndex].height = height;
            }
            
            // Check for marker URL
            match = attr.name.match(markerUrlPattern);
            if (match) {
                const markerIndex = match[1];
                const url = attr.value;
                
                if (!markersData[markerIndex]) {
                    markersData[markerIndex] = {};
                }
                markersData[markerIndex].url = url;
            }
            
            // Check for marker info window content
            match = attr.name.match(markerInfoPattern);
            if (match) {
                const markerIndex = match[1];
                const info = attr.value;
                
                if (!markersData[markerIndex]) {
                    markersData[markerIndex] = {};
                }
                markersData[markerIndex].info = info;
            }
        }
        
        // Now add all markers with their respective icons
        Object.keys(markersData).forEach(index => {
            const marker = markersData[index];
            if (marker.lat && marker.lng) {
                addMarker(
                    marker.lat, 
                    marker.lng, 
                    marker.title || '', 
                    marker.icon || window.defaultMarkerIcon,
                    marker.width || window.markerIconWidth,
                    marker.height || window.markerIconHeight,
                    marker.url || '',
                    marker.info || ''
                );
            }
        });
    }

    // Function to add a marker to the map
    function addMarker(lat, lng, title = '', iconUrl = null, width = 40, height = 40, url = '', infoContent = '') {
        if (!window.customGoogleMap) {
            console.error('Map not initialized yet. Call initCustomMap first.');
            return;
        }
        
        const markerOptions = {
            position: { lat, lng },
            map: window.customGoogleMap,
            title: title
        };
        
        // Add custom icon if provided
        if (iconUrl) {
            // Create a new image to get the natural dimensions
            const img = new Image();
            
            // Create a temporary marker that will be replaced once the image loads
            const tempMarker = new google.maps.Marker(markerOptions);
            
            // Create info window if content is provided
            let infoWindow = null;
            if (infoContent) {
                infoWindow = new google.maps.InfoWindow({
                    content: infoContent
                });
                
                tempMarker.addListener('click', function() {
                    // Close any open info window
                    if (activeInfoWindow) {
                        activeInfoWindow.close();
                    }
                    
                    infoWindow.open(window.customGoogleMap, tempMarker);
                    activeInfoWindow = infoWindow;
                });
            }
            
            img.onload = function() {
                // If no custom dimensions are specified, use the natural dimensions
                const useWidth = width || img.width;
                const useHeight = height || img.height;
                
                // Calculate anchor point (center horizontally, bottom vertically)
                const anchorX = useWidth / 2;
                const anchorY = useHeight;
                
                // Remove the temporary marker
                tempMarker.setMap(null);
                
                // Create marker with custom icon
                const marker = new google.maps.Marker({
                    position: { lat, lng },
                    map: window.customGoogleMap,
                    title: title,
                    icon: {
                        url: iconUrl,
                        scaledSize: new google.maps.Size(useWidth, useHeight),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(anchorX, anchorY)
                    }
                });
                
                // Add click handlers
                if (infoContent) {
                    // Create a new info window for the permanent marker
                    const newInfoWindow = new google.maps.InfoWindow({
                        content: infoContent
                    });
                    
                    marker.addListener('click', function() {
                        // Close any open info window
                        if (activeInfoWindow) {
                            activeInfoWindow.close();
                        }
                        
                        newInfoWindow.open(window.customGoogleMap, marker);
                        activeInfoWindow = newInfoWindow;
                        
                        // If URL is also provided, open it in a new tab after a short delay
                        if (url) {
                            setTimeout(function() {
                                window.open(url, '_blank');
                            }, 300);
                        }
                    });
                } else if (url) {
                    // If only URL is provided (no info window)
                    marker.addListener('click', function() {
                        window.open(url, '_blank');
                    });
                }
                
                return marker;
            };
            
            img.src = iconUrl;
            
            // Add click handler to temporary marker if URL is provided and no info content
            if (url && !infoContent) {
                tempMarker.addListener('click', function() {
                    window.open(url, '_blank');
                });
            }
            
            return tempMarker;
        } else {
            // Use default Google marker
            const marker = new google.maps.Marker(markerOptions);
            
            // Create info window if content is provided
            if (infoContent) {
                const infoWindow = new google.maps.InfoWindow({
                    content: infoContent
                });
                
                marker.addListener('click', function() {
                    // Close any open info window
                    if (activeInfoWindow) {
                        activeInfoWindow.close();
                    }
                    
                    infoWindow.open(window.customGoogleMap, marker);
                    activeInfoWindow = infoWindow;
                    
                    // If URL is also provided, open it in a new tab after a short delay
                    if (url) {
                        setTimeout(function() {
                            window.open(url, '_blank');
                        }, 300);
                    }
                });
            } else if (url) {
                // If only URL is provided (no info window)
                marker.addListener('click', function() {
                    window.open(url, '_blank');
                });
            }
            
            return marker;
        }
    }

    // Expose functions to global scope for external use if needed
    window.initCustomMap = initCustomMap;
    window.addMarker = addMarker;
    window.findAndAddMarkers = findAndAddMarkers;
})();

// Usage instructions:
// 1. Add a div with id="map" to your Webflow page with optional data attributes:
//    <div id="map" 
//         data-lat="51.5074" 
//         data-lng="-0.1278" 
//         data-zoom="12"
//         data-min-zoom="2" <!-- Optional: Minimum zoom level (1-20) -->
//         data-max-zoom="18" <!-- Optional: Maximum zoom level (1-20) -->
//         data-api-key="YOUR_GOOGLE_MAPS_API_KEY" <!-- Optional: Override the default API key -->
//         data-styles-url="https://example.com/map-styles.json" <!-- Optional: Override the default styles URL -->
//         data-map-type="roadmap" <!-- Optional: roadmap, satellite, hybrid, terrain -->
//         data-show-controls="true" <!-- Optional: Show/hide map controls -->
//         data-scroll-zoom="true" <!-- Optional: Enable/disable scroll wheel zoom -->
//         data-open-google-maps="false" <!-- Optional: Open Google Maps when clicking on the map -->
//         data-marker-icon="https://example.com/default-marker.png" <!-- Global default marker icon -->
//         data-marker-width="40" <!-- Global default marker width -->
//         data-marker-height="40" <!-- Global default marker height -->
//         data-marker-1="51.5074, -0.1278, London"
//         data-marker-1-icon="https://example.com/london-marker.png" <!-- Custom icon for marker 1 -->
//         data-marker-1-width="50" <!-- Custom width for marker 1 -->
//         data-marker-1-height="50" <!-- Custom height for marker 1 -->
//         data-marker-1-url="https://example.com/london" <!-- URL to open when marker 1 is clicked -->
//         data-marker-1-info="<h3>London</h3><p>The capital of England</p>" <!-- Info window content for marker 1 -->
//         data-marker-2="40.7128, -74.0060, New York"
//         data-marker-2-info="<h3>New York</h3><p>The Big Apple</p>" <!-- Info window content for marker 2 -->
//         data-marker-3="34.0522, -118.2437, Los Angeles"
//         data-marker-3-icon="https://example.com/la-marker.png" <!-- Custom icon for marker 3 -->
//         data-marker-3-info="<h3>Los Angeles</h3><p>City of Angels</p>" <!-- Info window content for marker 3 -->
//         style="height: 500px; width: 100%;">
//    </div>
//
// 2. Or use separate marker elements (legacy approach):
//    <div data-marker data-lat="51.5074" data-lng="-0.1278" data-title="London" data-icon="https://example.com/london-marker.png" data-width="50" data-height="50" data-url="https://example.com/london" data-info="<h3>London</h3><p>Click for more info</p>"></div>
//
// 3. Add this script to your page's custom code section in the head
// 4. The map will initialize automatically with the settings from data attributes or defaults 