const output = document.getElementById("output")
const container = document.getElementById("map-container");
const boom = document.getElementById("boom-test");
let id;
update = 0;

target1 = {
    latitude: 52.227306,
    longitude: -0.677861,
};

target2 = {
    latitude: 52.244722,
    longitude: -0.675694,
};

target3 = {
    latitude: 52.257722,
    longitude: -0.678389,
};

const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
};

const watchOptions = {
    enableHighAccuracy: true,
    timeout: Infinity,
    maximumAge: 0,
};

function updateLocation() {
    navigator.geolocation.getCurrentPosition(success, error, options);
}

function getLocation() {
    if (!navigator.geolocation) {
        output.textContent = 'Geolocation is not supported by your browser.';
        return;
    }

    if (update == 0) {
        output.textContent = 'Locating...';
        //navigator.geolocation.getCurrentPosition(success, error, options);
        id = navigator.geolocation.watchPosition(success, error, watchOptions);
        // id = setInterval(updateLocation, 3000);
        return;
    }
}

function stopGetLocation() {
    if (id) {
        navigator.geolocation.clearWatch(id);
    }
    // clearInterval(id);
    // id = null;
}

function success(position){
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const accuracy = position.coords.accuracy;

    output.innerHTML = `
        <strong>Latitude:</strong> ${latitude} <br>
        <strong>Longitude:</strong> ${longitude} <br>
        <strong>Accuracy:</strong> ${accuracy} meters <br>
        <strong>Distance1:</strong> ${getDistanceFromLatLonInMeters(latitude, longitude, target1.latitude, target1.longitude)} meters <br>
        <strong>Distance2:</strong> ${getDistanceFromLatLonInMeters(latitude, longitude, target2.latitude, target2.longitude)} meters <br>
        <strong>Distance3:</strong> ${getDistanceFromLatLonInMeters(latitude, longitude, target3.latitude, target3.longitude)} meters <br>
        <strong>Update:<\strong> ${update}
    `;

    update++;

    if (getDistanceFromLatLonInMeters(latitude, longitude, target1.latitude, target1.longitude) < 15 && !boom.isPaused) {
        boom.play();
    }

    if (getDistanceFromLatLonInMeters(latitude, longitude, target2.latitude, target2.longitude) < 20 && !boom.isPaused) {
        boom.play();
    }

    if (getDistanceFromLatLonInMeters(latitude, longitude, target3.latitude, target3.longitude) < 10 && !boom.isPaused) {
        boom.play();
    }

}

function error(error) {
    output.textContent = `Error: ${error.message}`;
}

function successShowMap(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    loadWazeMap(latitude, longitude);
}

function errorShowMap(error) {
    container.innerHTML = `Error: ${error.message}`;
}

function showMap() {
    navigator.geolocation.getCurrentPosition(successShowMap, errorShowMap, options);
}

function hideMap() {
    container.innerHTML = "<p>Loading map...</p>";
}

function loadWazeMap(lat, lon) {
    const iframe = document.createElement('iframe');
    iframe.width = "100%";
    iframe.height = "600";
    iframe.src = `https://embed.waze.com/iframe?zoom=15&lat=${lat}&lon=${lon}&pin=1`;
    iframe.allowFullscreen = true;

    container.innerHTML = '';
    container.appendChild(iframe);
}

function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Earth radius in meters
    const toRad = deg => deg * (Math.PI / 180);
  
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
  
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return R * c;
}
