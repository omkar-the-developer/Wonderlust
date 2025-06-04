// ⛔ Block Mapbox telemetry POST requests silently
const originalFetch = window.fetch;
window.fetch = function (...args) {
    const url = args[0];
    if (typeof url === 'string' && url.includes('https://events.mapbox.com/events/v2')) {
        // Return a fake successful response to prevent 422 errors
        return Promise.resolve(new Response(null, { status: 204 }));
    }
    return originalFetch.apply(this, args);
};

mapboxgl.accessToken = mapToken;

const popup = new mapboxgl.Popup({
    offset: 25,
    closeButton: false,
    closeOnClick: false
}).setHTML(`<h5>${listing.location}</h5><p>Exact location will be provided after booking.</p>`);

// Create a custom marker with circle and a tail (pointing downwards)
const el = document.createElement('div');
el.className = 'custom-marker';

// Styling the circle and tail
el.style.position = 'relative';
el.style.width = '60px';
el.style.height = '60px';
el.style.borderRadius = '50%';
el.style.backgroundColor = 'rgba(218, 56, 27, 0.6)'; // Red circle with some opacity
el.style.display = 'flex';
el.style.justifyContent = 'center';
el.style.alignItems = 'center';
el.style.cursor = 'pointer';

// Create the triangle (tail) pointing down
const tail = document.createElement('div');
tail.style.position = 'absolute';
tail.style.bottom = '-10px'; // Positioning the triangle
tail.style.left = '50%';
tail.style.transform = 'translateX(-50%)';
tail.style.width = '0';
tail.style.height = '0';
tail.style.borderLeft = '5px solid transparent';
tail.style.borderRight = '5px solid transparent';
tail.style.borderTop = '10px solid rgba(218, 56, 27, 0.6)'; // Same color as circle

// Append the triangle (tail) to the circle
el.appendChild(tail);

// Add the icon (Font Awesome location arrow) to the center of the circle
const icon = document.createElement('i');
icon.className = 'fa-solid fa-location-arrow';
icon.style.color = '#ffffff'; // White icon
icon.style.fontSize = '25px';
el.appendChild(icon);

// Create the map
const map = new mapboxgl.Map({
    container: 'map',
    style: "mapbox://styles/mapbox/streets-v12",
    center: listing.geometry.coordinates,
    zoom: 9
});

// Add the marker to the map
new mapboxgl.Marker(el)
    .setLngLat(listing.geometry.coordinates)
    .addTo(map);

// Show the popup on hover
el.addEventListener('mouseenter', () => popup.addTo(map).setLngLat(listing.geometry.coordinates));
el.addEventListener('mouseleave', () => popup.remove());
