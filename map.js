'use strict';

var goal = L.latLng(51.55857,5.12213);
var locationMarker = L.marker(goal);

function onLocationError(e) {

    // alert(e.message);
    console.log(e.message);
    // stopLocate();
}

function updatelocation(map,e) {


  locationMarker.setLatLng(e.latlng);
  map.panTo(e.latlng);

}

function initMap() {
    var map = L.map('map');

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    map.setView([0,0],20) ;

    L.marker(goal).addTo(map);
    locationMarker.addTo(map);

    let setMarker = function (e) {


      let radius = e.accuracy / 2
      locationMarker.bindPopup("You are within " + Math.round (radius) + " meters from this point").openPopup();
      updatelocation(map,e);
    }

    map.once('locationfound', setMarker);
    map.on('locationerror', onLocationError);

    L.control.scale( {
        position:'bottomright',
        imperial:false,
        updateWhenIdle:false
      }).addTo(map);

    map.locate({setView: true, watch :false});

    let edgeLayer = L.edgeMarker({
          icon: L.icon({
              iconUrl: 'images/edge-arrow-marker.png',
              // clickable: false,
              iconSize: [48, 48]
              })
          })
    edgeLayer.addTo(map);

    var sidebar = L.control.sidebar('sidebar').addTo(map);
    return map
}

// TODO refactor rename reorder
function follow (map){

    map.on('locationfound', function (e) {
        updatelocation (map,e);
    });
    map.on('locationfound',succes); // does not work now

    map.locate({setView: false, watch :true, timeout:5000});

}
function succes(e){

  if (e.latlng.distanceTo(goal) < 5) {
    window.open("https://www.w3schools.com");
  }
}
var map = initMap();
follow(map);
