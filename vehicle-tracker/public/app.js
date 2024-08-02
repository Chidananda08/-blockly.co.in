let map;
let vehicleMarker;
let vehiclePath = [];

async function fetchVehicleData() {
  const response = await fetch('/api/vehicle');
  const data = await response.json();
  return data;
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 17.385044, lng: 78.486671 },
    zoom: 14,
  });

  vehicleMarker = new google.maps.Marker({
    map: map,
    icon: 'vehicle_icon.png',
    scaledSize: new google.maps.Size(32, 32) // Ensure this file is correctly placed in the public folder
  });

  updateVehicleLocation();
}

async function updateVehicleLocation() {
  const vehicleData = await fetchVehicleData();
  const pathCoordinates = vehicleData.map(point => ({
    lat: point.latitude,
    lng: point.longitude
  }));

  if (vehiclePath.length > 0) {
    vehiclePath.forEach(segment => segment.setMap(null));
  }

  const flightPath = new google.maps.Polyline({
    path: pathCoordinates,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2,
  });

  flightPath.setMap(map);
  vehiclePath.push(flightPath);

  const latestPosition = pathCoordinates[pathCoordinates.length - 1];
  vehicleMarker.setPosition(latestPosition);
  map.panTo(latestPosition);

  setTimeout(updateVehicleLocation, 5000); // Update every 5 seconds
}

window.initMap = initMap;
