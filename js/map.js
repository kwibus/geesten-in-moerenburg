'use strict';
var zomberlust=L.latLng(51.55938707072835,5.11301726102829);
var sidebar=L.control.sidebar('sidebar');

function Goal (name , latLng, image){
  return {
    name: name ,
    latLng: L.latLng (latLng),
    image: image,
  };
}

var goalN = 0;
var goals = [
    Goal ("Langs de oever van de Korvelse Waterloop",[51.558567,5.122133], 'images/halte1.jpg'),
    Goal ("De Buunder/ het Grollegat",[51.55655 ,5.124533], 'images/halte2.jpg'),
    Goal ("Bij het bruggetje over de Leij",[51.555333,5.1225],   'images/halte3.jpg'),
    Goal ("Aan de Kommerstraat",[51.5557  ,5.1212],   'images/halte4.jpg'),
    Goal ("Langs de Meijerijbaan",[51.554233,5.120233], 'images/halte5.jpg'),
    Goal ("Aan de Lange Jan",[51.553717,5.115183], 'images/halte6.jpg'),
    Goal ("Het Water Paviljoen",[51.55535 ,5.11645],  'images/halte7.jpg'),
    Goal ("Toegang naar het Helofytenfilter",[51.5565  ,5.114183], 'images/halte8.jpg'),
    Goal ("Huize Moerenburg",[51.557067,5.117467], 'images/halte9.jpg'),
    Goal ("Huize Moerenburg",[51.557067,5.117467], 'images/halte9.jpg'),
    ];


var goal=goals[goalN];
var goalMarkerCircle = L.circle(goal.latLng,goalRadious);
var goalMarkerPhoto= L.marker(goal.latLng);
setPictureMarker(goalMarkerPhoto,goal);

var locationRadius=0;
var curentlocation = undefined;
var locationMarker = L.marker([90,0]);

var line = undefined;
var goalRadious = 10;
var accuracyCircle = undefined;

var bounds =L.latLngBounds( [51.56239854,5.10838509],[51.54857681,5.13868332]);

function highlightGoal() {
  sidebar.close();
  map.fitBounds(line.getBounds());
  goalMarkerPhoto.openPopup();
  locationMarker.openTooltip();
}

function nextgoal(){
   setgoal (goals[++goalN]);
}

function setgoal(newgoal){
    goal = newgoal;
    line.getLatLngs()[1] = goal.latLng;

    goalMarkerCircle.setLatLng(goal.latLng);
    goalMarkerPhoto.setLatLng(goal.latLng);
    setPictureMarker(goalMarkerPhoto, goal)
}

function setPictureMarker(marker,goal){

    marker.closePopup();
    marker.setIcon  (
        L.icon({
              iconUrl:goal.image,

              iconSize:     [40, 40],
              iconAnchor: [0, 40],
              className: 'leaflet-popup-photo',
                })
        );

    marker.bindPopup(
        "<figure > <img src="+goal.image+"> <figcaption>" + goal.name + "</figcaption> </figure>"
        ,{className: 'leaflet-popup-photo'}
        );
}

function onLocationError(e) {

    // alert(e.message);
    console.log(e.message);
    // stopLocate();
}

function updatelocation(map,e) {

  locationRadius=e.accuracy;
  locationMarker.setLatLng(e.latlng);

  if ( bounds.contains(e.latlng) ){
    map.setMaxBounds(bounds);

  }else {
    map.setMaxBounds( undefined);
  }

  if (typeof(goal) !== 'undefined') {
      line.setLatLngs([e.latlng,goal.latLng]);
  }
}

function getLocationRadious(){return locationRadius;}

function initGoal(map){

    goalMarkerCircle.addTo(map);
    goalMarkerPhoto.addTo(map);
    goalMarkerPhoto.bindEdgeMarker();

}

function initLocation(){

    let setMarker = function (e) {
        locationMarker.bindTooltip();
        updatelocation(map,e);
        map.fitBounds(line.getBounds());
    }

    map.once('locationfound', setMarker);

    map.locate({setView: true, watch :false});
    locationMarker.addTo(map);


    locationMarker.on ('tooltipopen', function () {

      let latLng = locationMarker.getLatLng();
      let accuracy = getLocationRadious();

      accuracyCircle=L.circle (latLng, accuracy).addTo(map);
      let tooltip = this
      function updateTooltip (latLng,accuracy){
        accuracyCircle.setLatLng(latLng);
        accuracyCircle.setRadius(accuracy);
        tooltip.setTooltipContent("Je bevind zich binnen een straal van " + Math.round (accuracy) + " meters van dit punt");
      };
      updateTooltip(latLng, accuracy);
      map.on('locationfound',function (e){
        updateTooltip (e.latlng,e.accuracy);
      });
    });
    locationMarker.on ('tooltipclose', function () {accuracyCircle.remove() ;} );
}

function initLine(map){
    var latlngs = [goal.latLng,goal.latLng];
    line = L.polyline(latlngs, {color: 'green'}).addTo(map);
    line.on( 'click', (function (e) {
        map.openPopup(
            (Math.round(locationMarker.getLatLng().distanceTo(goalMarkerCircle.getLatLng())) + "m")
           , e.latlng
        );
    }));
}

function initMap() {

    document.getElementById("map").style.height=window.innerHeight + "px";
    var map = L.map('map',{attributionControl:false});

    document.body.onresize = function (){
      document.getElementById("map").style.height=window.innerHeight + "px";
      map.invalidateSize();
    };
    var layer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution:'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community',
        useCache: true,
        // useOnlyCache: true,
        crossOrigin: true
    })

    layer.addTo(map);
    layer._map=map;
    layer.seed (bounds,16,18);

    map.setView(zomberlust,16) ;

    map.on('locationerror', onLocationError);

    L.control.scale( {
        position:'bottomright',
        imperial:false,
        updateWhenIdle:false
      }).addTo(map);


    map.attributionControl=false;
    map.zoomControl.setPosition('topright');
    sidebar.addTo(map);
    sidebar.open("Introductie")


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
    map.on('locationfound',succes);


    map.locate({setView: false, watch :true, maximumAge: 5000,enableHighAccuracy:true});
}

function succes(e){

  if (typeof(goal) !== 'undefined') {
      if (e.latlng.distanceTo(goal.latLng) < goalRadious) {
      goal=undefined;
        if (navigator.vibrate) {
             navigator.vibrate(1000);
        }
        if (document.getElementById("next"+currentquestion)){
          let nextLink = document.getElementById("next"+currentquestion);
          nextLink.removeAttribute("href");
          nextLink.removeAttribute("onClick");
          console.log(nextLink);

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
initLine(map);
initGoal(map);
initLocation(map);

var goalN =checkCurrentquestion();
if (goalN !== 0){
    setgoal(goals[goalN]);
}
setcurrentQuestion(goalN);
follow(map);
