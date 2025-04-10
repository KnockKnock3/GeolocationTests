const output = document.getElementById("output")

const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

function getLocation() {
    if (!navigator.geolocation) {
        output.textContent = 'Geolocation is not supported by your browser.';
        return;
    }

    output.textContent = 'Locating...';
    navigator.geolocation.getCurrentPosition(success, error, options);
}

function success(position){
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const accuracy = position.coords.accuracy;

    output.innerHTML = `
        <strong>Latitude:</strong> ${latitude} <br>
        <strong>Longitude:</strong> ${longitude} <br>
        <strong>Accuracy:</strong> ${accuracy} meters
    `;

    loadWazeMap(latitude, longitude);
}

function error(error) {
    output.textContent = `Error: ${error.message}`;
}

function loadWazeMap(lat, lon) {
    const iframe = document.createElement('iframe');
    iframe.width = "100%";
    iframe.height = "600";
    iframe.src = `https://embed.waze.com/iframe?zoom=15&lat=${lat}&lon=${lon}&pin=1`;
    iframe.allowFullscreen = true;

    const container = document.getElementById('map-container');
    container.innerHTML = ''; // Clear loading message
    container.appendChild(iframe);
  }
