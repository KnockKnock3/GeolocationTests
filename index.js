const output = document.getElementById("output")
let id;
firstTime = true;
update = 1;

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

function getLocation() {
    if (!navigator.geolocation) {
        output.textContent = 'Geolocation is not supported by your browser.';
        return;
    }

    if (firstTime) {
        output.textContent = 'Locating...';
        //navigator.geolocation.getCurrentPosition(success, error, options);
        id = navigator.geolocation.watchPosition(success, error, options);
        return;
    }
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

    if (firstTime) {
        loadWazeMap(latitude, longitude);
        firstTime = false;
    }
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
