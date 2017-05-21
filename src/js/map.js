
var L = require('leaflet');

L.Icon.Default.imagePath = 'images/';

require('leaflet-easybutton');
require('./Leaflet.EdgeMarker.js');
require('leaflet-rotatedmarker');
require('leaflet.tilelayer.fallback');

global.PouchDB = require('pouchdb');
require('leaflet.tilelayer.pouchdbcached');
require('leaflet-spin')(L);

global.Spinner = require('spin.js');
require('./leaflet-sidebar');

var Store = require('./storeProgres.js');
var Quize = require('./quiz.js');
var Alert= require('./myAlert.js');

var zomberlust = L.latLng(51.55938707072835,5.11301726102829);

global.sidebar = L.control.sidebar('sidebar');

var foundGpsError=false;
function Goal (name , latLng, image){
  return {
    name: name ,
    latLng: L.latLng (latLng),
    image: image,
  };
}

var goals = [
  Goal ('Langs de oever van de Korvelse Waterloop',[51.558567,5.122133], 'images/halte1.jpg'),
  Goal ('De Buunder/ het Grollegat',[51.55655 ,5.124533], 'images/halte2.jpg'),
  Goal ('Bij het bruggetje over de Leij',[51.555333,5.1225],   'images/halte3.jpg'),
  Goal ('Aan de Kommerstraat',[51.5557  ,5.1212],   'images/halte4.jpg'),
  Goal ('Langs de Meijerijbaan',[51.554233,5.120233], 'images/halte5.jpg'),
  Goal ('Aan de Lange Jan',[51.553717,5.115183], 'images/halte6.jpg'),
  Goal ('Het Water Paviljoen',[51.55535 ,5.11645],  'images/halte7.jpg'),
  Goal ('Toegang naar het Helofytenfilter',[51.5565  ,5.114183], 'images/halte8.jpg'),
  Goal ('Huize Moerenburg',[51.557067,5.117467], 'images/halte9.jpg'),
];

var goalRadious = 10;
var goalMarkerCircle = undefined ;
var goalMarkerPhoto = undefined;

var locationRadius = 0;
var dumylocation = L.latLng(90,0);
var previuosLocation = dumylocation;
var locationMarker = undefined ; // L.marker(dumylocation);

var accuracyCircle = undefined;

var startTime=  new Date();
var lastUpdate = startTime.getTime();
var lastAngelUpdate= startTime.getTime();
var lastErrorTime = startTime.getTime();

var bounds = L.latLngBounds( [51.56239854,5.10838509],[51.54857681,5.13868332]);

function highlightGoal() {
  sidebar.close();
  map.fitBounds(line.getBounds());
  goalMarkerPhoto.openPopup();
}

function nextgoal(){
  setgoal (goals[++goalN]);
}

function setgoal(newgoal){
  goal = newgoal;

  if (newgoal!=undefined){
    if (line != undefined){
      var latLngs =  line.getLatLngs();
      latLngs[1]=goal.latLng;
      line.setLatLngs(latLngs);
      line.redraw();
    }
    goalMarkerCircle.setLatLng(goal.latLng);
    goalMarkerPhoto.setLatLng(goal.latLng);
    setPictureMarker(goalMarkerPhoto, goal);
  }
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
    '<figure > <img src='+goal.image+'> <figcaption>' + goal.name + '</figcaption> </figure>'
    ,{className: 'leaflet-popup-photo'}
  );
}

function onLocationError(error) {

  console.log(error.message);
  if (error.code===3 ){
    // error.code 3 = timout
    // this can happen because:
    //      gps is off
    //      page was on standby
    //      gps was slow, happens ones in will

    var date = new Date();
    var time=date.getTime();
    if (lastErrorTime - lastUpdate > 40000){
      Alert.myWarning ('gps staat uit');
      lastErrorTime = time;
      foundGpsError = true;
    }
    checkLocationResetAngel();
    lastErrorTime=time;
  }else{
    foundGpsError = true;
    Alert.myWarning(error.message);
  }
}

// http://www.movable-type.co.uk/scripts/latlong.html
function getBearing(here, there){

  var dLon = (there.lng  - here.lng);

  var y = Math.sin(dLon) * Math.cos(there.lat);
  var x = Math.cos(here.lat) * Math.sin(there.lat) - Math.sin(here.lat)
            * Math.cos(there.lat) * Math.cos(dLon);
  var rad=Math.atan2(x,y);
  var angel=(rad*-180)/(Math.PI);
  return angel;
}

function checkLocationResetAngel(){

  var date = new Date();
  var time=date.getTime();
  if (time-lastAngelUpdate > 7000){
    resetLocationAngel();
  }
}

function resetLocationAngel(){
  locationMarker.setIcon( new L.Icon.Default);
  locationMarker.setRotationAngle(0);
}

function setLocationAngel(currentLocation){

  var distance = currentLocation.distanceTo(previuosLocation);

  if(distance > 2*getLocationRadious()){
    if (distance < 1000){

      var angel = getBearing(previuosLocation,currentLocation);


      var date = new Date();
      lastAngelUpdate = date.getTime();

      locationMarker.setIcon  (
        L.icon({
          iconUrl:'images/arrow.png',
          iconSize:   [40, 40],
        })
      );

      locationMarker.setRotationOrigin('center center');
      locationMarker.setRotationAngle(angel);
    }
    previuosLocation=currentLocation;
  }else{
    checkLocationResetAngel();
  }
}

function updatelocation(map,e) {
  var date=new Date();
  lastUpdate=date.getTime();

  locationRadius=e.accuracy;
  locationMarker.setLatLng(e.latlng);

  setLocationAngel(e.latlng);

  if ( bounds.contains(e.latlng) ){
    map.setMaxBounds(bounds);

  } else {
    map.setMaxBounds( undefined);
  }
  if (line != undefined){
    var latLngs =  line.getLatLngs();
    latLngs[0]=e.latlng;
    line.setLatLngs(latLngs);
    line.redraw();
  }
}

function getLocationRadious(){return locationRadius;}

function initGoal(map,goal){
  if (goal != undefined){
    goalMarkerCircle = L.circle(goal.latLng,goalRadious);
    goalMarkerPhoto = L.marker(goal.latLng);
    goalMarkerCircle.addTo(map);
    goalMarkerPhoto.addTo(map);
    goalMarkerPhoto.bindEdgeMarker();
    setgoal(goal);
  }

}

function initLocation(map){

  map.spin(true);
  var setMarker = function (e) {
    var latLng = e.latlng;
    locationMarker = L.marker(e.latlng);
    locationMarker.bindTooltip('je bent hier');

    locationMarker.addTo(map);
    updatelocation(map,e);
    if (line!=undefined){
      var view=line.getBounds();
      map.fitBounds(view ,{maxzoom:16});
      // map.flyToBounds(view);
    } else {
      map.panTo(e.latlng);
    }
    map.spin(false);

    locationMarker.on ('tooltipopen', function () {

      var latLng = locationMarker.getLatLng();
      var accuracy = getLocationRadious();

      accuracyCircle=L.circle (latLng, accuracy).addTo(map);
      var tooltip = this
      function updateTooltip (latLng,accuracy){
        accuracyCircle.setLatLng(latLng);
        accuracyCircle.setRadius(accuracy);
      }

      updateTooltip(latLng, accuracy);
      map.on('locationfound',function (e){
        updateTooltip (e.latlng,e.accuracy);
      });
    });
    locationMarker.on ('tooltipclose', function () {accuracyCircle.remove() ;} );

    locationMarker.openTooltip();
  };

  map.once('locationfound', setMarker);

  map.locate({setView: false , watch :false});


}

function initLine(map,goal){
  var latlngs = [dumylocation,goal.latLng];
  var line = L.polyline(latlngs, {color: 'green'}).addTo(map);
  line.on( 'click', (function (e) {
    map.openPopup(
      (Math.round(locationMarker.getLatLng().distanceTo(goalMarkerCircle.getLatLng())) + 'm')
      , e.latlng
    );
  }));

  return line;
}

function initMap() {
  document.getElementById('map').style.height = window.innerHeight + 'px';
  var map = L.map('map',{attributionControl:false});

  document.body.onresize = function (){
    document.getElementById('map').style.height=window.innerHeight + 'px';
    map.invalidateSize();
  };
  var layer = L.tileLayer.fallback('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution:'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community',
    useCache: true,
    cacheMaxAge:60*60*24*10,
    crossOrigin: true,
    dbOptions:{size:40} ,
  });

  layer.addTo(map);
  layer.on('tilecacheerror',function(ev){
    console.log('Cache error: ', ev.tile, ev.error);
  });

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
  sidebar.open('Introductie') // its alreay manual opend but for consisent and history logic


  L.easyButton( {
    position: 'topright',
    states: [{
      icon:'fa-map-marker',
      onClick: function(btn, map){ map.panTo(locationMarker.getLatLng());}
    }]
  }).addTo(map);
  return map;
}

// TODO refactor rename reorder
function follow (map){

  map.on('locationfound', function (e) {
    updatelocation (map,e);
  });
  map.on('locationfound',succes);

  map.locate({setView: false , watch :true, maximumAge: 5000, enableHighAccuracy:true});
}

function succes(e){

  if (typeof(goal) !== 'undefined') {
    if (e.latlng.distanceTo(goal.latLng) < goalRadious) {
      goal=undefined;
      if (navigator.vibrate) {
        navigator.vibrate(1000);
      }
      var audio = new Audio('audio/success.mp3');
      audio.play();

      Quize.disableLinkGoal();
      Quize.nextTab();
      if (Quize.skipQuestion()){
        nextgoal();
      }
    }
  }
}

function checkGpsSucces(){

  if (locationMarker != undefined && !foundGpsError){
    Alert.myWarning ('GPS error. Herlaad pagina, Als date niet werkt zet je telefoon uit en aan  en prbeer opnieuw ');
  }else if (locationRadius > 30) {
    if (L.Browser.android){
      Alert.myWarning ('GPS is  te onnauwkeurig. controleer of je telefoon op nauwkeurig modus staat bij: insteling > location > modus');
    }else{
      Alert.myWarning ('GPS van dit apparaat is te onnauwkeurig voor dit spel.');
    }
  }
}

var map = initMap();

var goalN = Store.checkCurrentquestion();

var goal = goals[goalN];

Quize.setcurrentQuestion(goalN);

var line=undefined;

initGoal(map,goal);
initLocation(map);
if (goal != undefined){
  line = initLine(map,goal);
}
follow(map);

setTimeout( checkGpsSucces, 35000);

global.highlightGoal= highlightGoal;
global.nextTab = Quize.nextTab;
global.nextgoal = nextgoal;
global.correct = Quize.correct;
global.incorrect = Quize.incorrect;
global.checkKey = Quize.checkKey;
global.deleteSaves = Store.deleteSaves;

