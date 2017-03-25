'use strict';
var zomberlust=L.latLng(51.55938707072835,5.11301726102829);
var sidebar=L.control.sidebar('sidebar');

var goalN = 0;
var goals = [
    [51.558567,5.122133],
    [51.55655 ,5.124533],
    [51.555333,5.1225],
    [51.5557  ,5.1212],
    [51.554233,5.120233],
    [51.553717,5.115183],
    [51.55535 ,5.11645],
    [51.5565  ,5.114183],
    [51.557067,5.117467],
    ];

var images = [
    'images/halte1.jpg',
    'images/halte2.jpg',
    'images/halte3.jpg',
    'images/halte4.jpg',
    'images/halte5.jpg',
    'images/halte6.jpg',
    'images/halte7.jpg',
    'images/halte8.jpg'
];

var goal=goals[goalN];
var goalMarkerCircle = L.circle(goal,goalRadious);
var goalMarkerPhoto= L.marker(goal);
setPictureMarker(goalMarkerPhoto,images[0]);

var locationRadius=0;
var curentlocation = undefined;
var locationMarker = L.marker([90,0]);

var line = undefined;
var goalRadious = 10;
var accuracyCircle = undefined;

function highlightGoal() {
  sidebar.close();
  map.fitBounds(line.getBounds());
  goalMarkerPhoto.openPopup();
}

function nextgoal(){
   setgoal (++goalN);
}

function setgoal(n){
    goalN=n
    goal=goals[n];
    line.getLatLngs()[2] = goal;

    goalMarkerCircle.setLatLng(goal);
    goalMarkerPhoto.setLatLng(goal);
    setPictureMarker(goalMarkerPhoto,images[goalN])
}

function setPictureMarker(marker,photo){

    marker.closePopup();
    marker.setIcon  (
        L.icon({
              iconUrl:photo,

              iconSize:     [40, 40],
              iconAnchor: [0, 40],
              className: 'leaflet-popup-photo',
                })
        )

    marker.bindPopup(
        "<figure > <img src="+photo +"> <figcaption>bunder</figcaption> </figure>"
        ,{className: 'leaflet-popup-photo',
          minWidth: 200 }
        );
}

function onLocationError(e) {

    // alert(e.message);
    console.log(e.message);
    // stopLocate();
}

function updatelocation(map,e) {

  locationRadius=e.accuracy/2
  locationMarker.setLatLng(e.latlng);

  var bounds =L.latLngBounds( [51.56239854,5.10838509],[51.54857681,5.13868332]);
  if ( bounds.contains(e.latlng) ){
    map.setMaxBounds(bounds);

  }else {
    map.setMaxBounds( undefined);
  }

  if (typeof(goal) !== 'undefined') {
      line.setLatLngs([e.latlng,goal]);
  }
}

function getLocationRadious(){return locationRadius;}

function initMap() {
    var map = L.map('map');
    L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: '<span style="overflow:hidden; white-space:nowrap">Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community</span>'
            }).addTo(map);

    map.setView(zomberlust,20) ;

    goalMarkerCircle.addTo(map);
    goalMarkerPhoto.addTo(map);

    let setMarker = function (e) {
        let radius = e.accuracy / 2
        locationMarker.bindTooltip("je bevind zich binnen een straal van " + Math.round (radius) + " meters van dit punt");
        updatelocation(map,e);
        map.fitBounds(line.getBounds());
    }

    locationMarker.on ('tooltipopen', function () { accuracyCircle=L.circle (locationMarker.getLatLng(), getLocationRadious()).addTo(map);} );
    locationMarker.on ('tooltipclose', function () {accuracyCircle.remove() ;} );

    map.once('locationfound', setMarker);
    locationMarker.addTo(map);

    map.on('locationerror', onLocationError);

    L.control.scale( {
        position:'bottomright',
        imperial:false,
        updateWhenIdle:false
      }).addTo(map);

    map.locate({setView: true, watch :false});

    goalMarkerPhoto.bindEdgeMarker();
    map.zoomControl.setPosition('topright');
    sidebar.addTo(map);
    sidebar.open("Introductie")

    var latlngs = [goal,goal];
    line = L.polyline(latlngs, {color: 'green'}).addTo(map);
    line.bindTooltip();
    line.on( 'tooltipopen', function (e) {
        e.tooltip.setContent(Math.round(locationMarker.getLatLng().distanceTo(goalMarkerCircle.getLatLng())) + "m");
        });

    L.easyButton( {
        position: 'topright',
        states: [{
            icon:'fa-map-marker',
            onClick: function(btn, map){ map.panTo(locationMarker.getLatLng());}
        }]
    }).addTo(map);
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

  if (typeof(goal) !== 'undefined') {
      if (e.latlng.distanceTo(goal) < goalRadious) {
      goal=undefined;
        if (navigator.vibrate) {
             navigator.vibrate(1000);
        }
        nextTab();
        trySave();
        if (document.getElementById("next"+currentquestion)){
         nextgoal();
        }
      }
  }
}

var map = initMap();
follow(map);
