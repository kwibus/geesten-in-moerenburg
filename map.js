'use strict';
var zomberlust=L.latLng(51.55938707072835,5.11301726102829)
var sidebar=L.control.sidebar('sidebar');

var goalN = 0;
var goals =[[51.55857,5.12213],
            [51.55655,5.124533 ]
           ];
var goal=goals[goalN];
var goalMarker = L.marker(goal);

var curentlocation = zomberlust;
var locationMarker = L.marker(goal);
var line =undefined;


function nextgoal(){
    goalN++;
    goal=goals[goalN];
    line.getLatLngs().splice(1,1,goal);
    goalMarker.setLatLng(goal);
}

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

    goalMarker.addTo(map);
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
  goal=undefined;
    if (navigator.vibrate) {
         navigator.vibrate(1000);
    }
        nextTab();
  }
}
var map = initMap();
follow(map);
