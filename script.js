// DOM Elements
const searchBtn = document.getElementById('search-btn');// Search button
const clearBtn = document.createElement('button'); // Create Clear Button
const destinationInput = document.getElementById('destination-input');// Input field for destination
const weatherSection = document.getElementById('weather-section');// Weather display section
const weatherResults = document.getElementById('weather-results');// Container for weather data
const attractionsSection = document.getElementById('attractions-section');// Attractions display section
const attractionsResults = document.getElementById('attractions-results');// Container for attractions data
const searchSection = document.getElementById('search-section');// Section where search UI elements are located

// Add Clear Button to DOM
clearBtn.textContent = 'Clear';// Button text
clearBtn.id = 'clear-btn';// Assign an ID to the button
clearBtn.style.display = 'none'; // Initially hidden
searchSection.appendChild(clearBtn);

// Function to Show Loading Indicator
function showLoading() {
  searchBtn.textContent = 'Searching...';// Change button text to indicate loading
  searchBtn.disabled = true;// Disable button to prevent multiple clicks
}

// Function to Hide Loading Indicator
function hideLoading() {
  searchBtn.textContent = 'Search';// Restore button text
  searchBtn.disabled = false;// Enable button
}

// Fetch Weather Data
async function fetchWeather(lat, lon) {
  showLoading(); // Show loading indicator
  const url = `https://weatherbit-v1-mashape.p.rapidapi.com/forecast/3hourly?lat=${lat}&lon=${lon}&units=imperial&lang=en`;
  const options = {
    method: 'GET',
    headers: {
      //I've removed the API key for security reasons. Please add your own API key here.
    }
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error('Failed to fetch weather data');
    const result = await response.json();
    displayWeather(result);// Display weather data
  } catch (error) {
    console.error(error);
    alert('Unable to fetch weather data. Please try again.');
  } finally {
    hideLoading(); // Hide loading indicator after completion
  }
}

// Display Weather Data
function displayWeather(data) {
  weatherSection.classList.remove('hidden');// Show weather section
  weatherResults.innerHTML = `
    <div class="card">
      <h3>Weather in ${data.city_name}</h3>
      <p>Temperature: ${data.data[0].temp}°F</p>
      <p>Weather: ${data.data[0].weather.description}</p>
    </div>
  `;
}

// Fetch Attractions Data using Real-Time TripAdvisor Scraper API
async function fetchAttractions(location) {
  showLoading(); // Show loading indicator
  const url = `https://real-time-tripadvisor-scraper-api.p.rapidapi.com/tripadvisor_restaurants_search_v2?location=${encodeURIComponent(location)}`;
  const options = {
    method: 'GET',
    headers: {
      // I've removed the API key for security reasons. Please add your own API key here.
    }
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`);
    const result = await response.json();
    displayAttractions(result);// Display attraction data
  } catch (error) {
    console.error(error);
    alert(`Unable to fetch attractions data. Error: ${error.message}`);
  } finally {
    hideLoading(); // Hide loading indicator
  }
}

// Display Attractions Data
function displayAttractions(data) {
  attractionsSection.classList.remove('hidden');
  attractionsResults.innerHTML = data.data.map(attraction => `
    <div class="card">
      <h3>${attraction.name}</h3>
      <p>Rating: ${attraction.rating || 'No rating available'}</p>
      <p>Address: ${attraction.address.fullAddress || 'No address available'}</p>
    </div>
  `).join('');
  console.log(data.data);// Log data for debugging
}

// Handle Search
searchBtn.addEventListener('click', () => {
  const destination = destinationInput.value.trim();
  if (destination) {
    // Replace with geocoding API for actual lat/lon values if needed
    const lat = 35.5; // Placeholder latitude
    const lon = -78.5; // Placeholder longitude
    fetchWeather(lat, lon);

    // Use the Real-Time TripAdvisor Scraper API to fetch attractions
    fetchAttractions(destination);

    // Show Clear Button
    clearBtn.style.display = 'block';
  } else {
    alert('Please enter a destination!');
  }
});

// Handle Clear Button
clearBtn.addEventListener('click', () => {
  destinationInput.value = '';// Clear input field
  weatherSection.classList.add('hidden');// Hide weather section
  attractionsSection.classList.add('hidden'); // Hide attractions section
  weatherResults.innerHTML = '';// Clear weather data
  attractionsResults.innerHTML = '';// Clear attractions data
  clearBtn.style.display = 'none';// Hide Clear button
});
