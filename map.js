'use strict';
var zomberlust=L.latLng(51.55938707072835,5.11301726102829)
var sidebar=L.control.sidebar('sidebar');
var goalN = 0;
var goal =L.latLng(51.55857,5.12213);
var curentlocation = zomberlust;
var locationMarker = L.marker(goal);
var line =undefined;




function onLocationError(e) {

    // alert(e.message);
    console.log(e.message);
    // stopLocate();
}

function updatelocation(map,e) {

  locationMarker.setLatLng(e.latlng);
  map.panTo(e.latlng);
  line.setLatLngs([e.latlng,goal]);
}

function initMap() {
    var map = L.map('map');

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    map.setView(curentlocation,20) ;

    L.marker(goal).addTo(map);
    locationMarker.addTo(map);

    let setMarker = function (e) {
        let radius = e.accuracy / 2
        locationMarker.bindPopup("You are within " + Math.round (radius) + " meters from this point").openPopup();
        locationMarker.bindTooltip("my tooltip text").openTooltip();
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

    let edgeLayer = L.edgeMarker(goal);//.bindTooltip("goal").openTooltip();
    edgeLayer.addTo(map);
    map.zoomControl.setPosition('topright');

    sidebar.addTo(map);
    sidebar.open("Introductie")

    // create a red polyline from an array of LatLng points
    var latlngs = [ curentlocation ,goal];
    line = L.polyline(latlngs, {color: 'green'}).addTo(map);
    // zoom the map to the polyline
    // map.fitBounds(polyline.getBounds());

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
