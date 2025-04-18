class TokenQueue { // From GPT
    constructor(audioDict) {
        this.queue = [];
        this.processing = false;
        this.audioDict = audioDict;
    }
  
    enqueue(token) {
        this.queue.push(token);
        if (!this.processing) {
            this.startProcessing();
        }
    }

    enqueueMany(tokens) {
        this.queue.push(...tokens); // Add all tokens to the queue
        if (!this.processing) {
          this.startProcessing();
        }
    }
  
    async startProcessing() {
        this.processing = true;
        while (this.queue.length > 0) {
            const token = this.queue.shift();
            await this.playAudio(token);
        }
        this.processing = false;
    }
  
    async playAudio(token) {
        const audio = this.audioDict[token];
        if (!audio) {
            console.warn(`No audio for token: "${token}"`);
            return;
        }
    
        // Clone the audio element to allow overlap/restarts
        const audioClone = audio.cloneNode();
        audioClone.play();
    
        await new Promise(resolve => {
                audioClone.onended = resolve;
                audioClone.onerror = () => {
                console.error(`Failed to play audio for token: "${token}"`);
                resolve();
            };
        });
    }
}
  

const output = document.getElementById("output")
const mapContainer = document.getElementById("map-container");
let id;
update = 0;

const audioDict = {
    "1l": new Audio("vine-boom.mp3"),
    "2l": new Audio("vine-boom-reverb.mp3"),
    "3l": new Audio("vine-boom-pitch.mp3"),
    "4l": new Audio("vine-boom-tempo.mp3"),
    "s": new Audio("vine-boom-reverse.mp3"),
};

const queue = new TokenQueue(audioDict);

targets = [
    { latitude: 52.227306, longitude: -0.677861, visited: false, range: 30, tokens: "1l" },
    { latitude: 52.244722, longitude: -0.675694, visited: false, range: 30, tokens: "2l,3l"},
    { latitude: 52.257722, longitude: -0.678389, visited: false, range: 30, tokens: "4l,s"}
]

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

function getLocation() {
    if (!navigator.geolocation) {
        output.textContent = 'Geolocation is not supported by your browser.';
        return;
    }

    if (update == 0) {
        output.textContent = 'Locating...';
        id = navigator.geolocation.watchPosition(success, error, watchOptions);
        
        targets.forEach(element => {
            element.visited = false;
        });
        return;
    }
}

function stopGetLocation() {
    if (id) {
        navigator.geolocation.clearWatch(id);
        id = null;
    }
}

function success(position){
    const coords = position.coords;
    const latitude = coords.latitude;
    const longitude = coords.longitude;

    output.innerHTML = `
        <strong>Latitude:</strong> ${latitude} <br>
        <strong>Longitude:</strong> ${longitude} <br>
        <strong>Accuracy:</strong> ${coords.accuracy} meters <br>
        <strong>Altitude:</strong> ${coords.altitude} meters <br>
        <strong>Altitude Accuracy:</strong> ${coords.altitudeAccuracy} meters <br>
        <strong>Heading:</strong> ${coords.heading} <br>
        <strong>Speed:</strong> ${coords.speed} <br>
        <strong>Update:<\strong> ${update}
    `;

    update++;

    targets.forEach(element => {
        if (!element.visited) {
            distance = getDistanceFromLatLonInMeters(latitude, longitude, element.latitude, element.longitude);
            if (distance <= element.range) {
                element.visited = true;
                tokensToAdd = element.tokens.split(",");
                queue.enqueueMany(tokensToAdd);
            }
        }
    });

}

function error(error) {
    output.textContent = `Error: ${error.message}`;
}

function testAudio() {
    for (const element of targets) {
        queue.enqueueMany(element.tokens.split(","));
    }
}



function successShowMap(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    loadWazeMap(latitude, longitude);
}

function errorShowMap(error) {
    mapContainer.innerHTML = `Error: ${error.message}`;
}

function showMap() {
    navigator.geolocation.getCurrentPosition(successShowMap, errorShowMap, options);
}

function hideMap() {
    mapContainer.innerHTML = "<p>Loading map...</p>";
}

function loadWazeMap(lat, lon) {
    const iframe = document.createElement('iframe');
    iframe.width = "100%";
    iframe.height = "600";
    iframe.src = `https://embed.waze.com/iframe?zoom=15&lat=${lat}&lon=${lon}&pin=1`;
    iframe.allowFullscreen = true;

    mapContainer.innerHTML = '';
    mapContainer.appendChild(iframe);
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

// setTimeout(() => queue.enqueueMany(["1l", "2l", "3l"]), 3000);
