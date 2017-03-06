"use strict";

var locationMarker = undefined;

function onLocationError(e) {
    console.log(e.message);
    // stopLocate();
}

function updatelocation(map,e) {

  var radius = e.accuracy / 2;
  // map.removeLayer(locationMarker);
  locationMarker.setLatLng(e.latlng);
  // map.addLayer(locationMarker);
  map.setZoom(20);
  map.panTo(e.latlng)
}

function initMap() {
    var map = L.map('map');

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    function setMarker (e){

      let radius = e.accuracy / 2;
      locationMarker = L.circleMarker(e.latlng,radius).bindPopup("You are within " + Math.round (radius) + " meters from this point").openPopup();
      locationMarker.addTo(map);
      map.setZoom(20);
      updatelocation(map,e);
    }

    map.on('locationfound', setMarker);
    map.on('locationerror', onLocationError);
    map.locate({setView: true, watch :false});

    L.control.scale( {
        imperial:false,
        updateWhenIdle:false
      }).addTo(map);
    L.marker([51.55857,5.12213]).addTo(map);

    L.edgeMarker({
      icon: L.icon({ // style markers
          iconUrl: 'images/edge-arrow-marker.png',
          clickable: true,
          iconSize: [48, 48],
          iconAnchor: [24, 24]
      }),
      rotateIcons: true, // rotate EdgeMarkers depending on their relative position
      layerGroup: null // you can specify a certain L.layerGroup to create the edge markers from.
    }).addTo(map);
    return map
}

function follow (map){

    map.on('locationfound', function (e) {updatelocation (map,e);});
    map.locate({setView: true, watch :true,timeout:1000});

}

var map = initMap();
follow(map);
