// Initialize the map with a focus on America
var map = L.map('map').setView([39.8283, -98.5795], 4);

// Set up the OpenStreetMap layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Function to add a marker to the map
function addMarker(name, lat, lng, cuisine, address) {
    L.marker([lat, lng])
        .addTo(map)
        .bindPopup(`<b>${name}</b><br>${cuisine}<br>${address}`);
}

// Load restaurant data from the server
fetch('/restaurants')
    .then(response => response.json())
    .then(data => {
        data.restaurants.forEach(restaurant => {
            const address = `${restaurant.street}, ${restaurant.city}, ${restaurant.state} ${restaurant.zip}`;
            addMarker(restaurant.name, restaurant.lat, restaurant.lng, restaurant.cuisine, address);
        });
    })
    .catch(error => console.error('Error loading restaurant data:', error));

// Handle form submission
document.getElementById('restaurant-form').addEventListener('submit', function(event) {
    event.preventDefault();

    var name = document.getElementById('name').value;
    var street = document.getElementById('street').value;
    var city = document.getElementById('city').value;
    var state = document.getElementById('state').value;
    var zip = document.getElementById('zip').value;
    var cuisine = document.getElementById('cuisine').value;

    var address = `${street}, ${city}, ${state} ${zip}`;

    // Geocode the address
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                var lat = data[0].lat;
                var lng = data[0].lon;
                var restaurant = { name, lat, lng, cuisine, street, city, state, zip };
                addMarker(name, lat, lng, cuisine, address);

                // Save the restaurant to the server
                fetch('/restaurants', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(restaurant)
                })
                .then(response => {
                    if (response.ok) {
                        console.log('Restaurant added successfully');
                        // Clear the form fields
                        document.getElementById('restaurant-form').reset();
                    } else {
                        console.error('Error adding restaurant');
                    }
                })
                .catch(error => console.error('Error saving restaurant:', error));
            } else {
                alert('Address not found');
            }
        })
        .catch(error => console.error('Error geocoding address:', error));
});
