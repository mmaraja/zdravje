/* global L, distance */

var pot;
var markerji = [];

var mapa;
var obmocje;

const LAT = 46.0536077;
const LNG = 14.5247825;

              

window.addEventListener('load', function () {
  // Osnovne lastnosti mape
  var mapOptions = {
    center: [LAT, LNG],
    zoom: 12
    // maxZoom: 3
  };

  // Ustvarimo objekt mapa
  mapa = new L.map('mapa_id', mapOptions);

  var layer = new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

  mapa.addLayer(layer);
 // dodajMarker(LAT, LNG, "Porodišnica Ljubljana", "Šlajmerjeva ulica", "4");
  var popup = L.popup();

  function obKlikuNaMapo(e) {
    var latlng = e.latlng;
   
    prikazPoti(latlng);
  }

  mapa.on('click', obKlikuNaMapo);
  
  document.getElementById("izbrisiRezultate")
    .addEventListener("click", function() {
      for (var i=1; i < markerji.length; i++) {
        mapa.removeLayer(markerji[i]);  
      }
      document.getElementById("izbrisiRezultate").disabled = true;
    
      document.getElementById("dodajBolnice").disabled = false;
      document.getElementById("bolnice_rez").innerHTML = 0;
     
    });

  document.getElementById("idRadij")
    .addEventListener("click", function() {
      prikaziObmocje();
    });
    document.querySelector("#dodajBolnice").addEventListener('click', dodajBolnice);
  
});



function dodajBolnice() {
  pridobiPodatke("bolnisnice", function (jsonRezultat) {
    izrisRezultatov(jsonRezultat);
   
    document.getElementById("dodajBolnice").disabled = false;
    document.getElementById("izbrisiRezultate").disabled = false;
  });
}

function pridobiPodatke(bolnisnice, callback) {
  if (typeof(bolnisnice) != "string") return;

  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open("GET", "https://teaching.lavbic.net/cdn/OIS/DN3/" + 
    bolnisnice + ".json", true);
  xobj.onreadystatechange = function () {
   
    if (xobj.readyState == 4 && xobj.status == "200") {
        var json = JSON.parse(xobj.responseText);
    
          document.getElementById("bolnice_rez").innerHTML=json.features.length;  
     
        callback(json);
    }
  };
  xobj.send(null);
}


function dodajMarker(lat, lng, ime, ulica, broj) {
  var ikona = new L.Icon({
  iconUrl: 'http://leafletjs.com/examples/custom-icons/leaf-red.png',
   
	iconSize: [38, 60],
	iconAnchor: [22, 60],
	popupAnchor: [-3, -56],
	shadowSize: [58, 85],
	shadowAnchor: [22, 80]
  });

  var marker = L.marker([lat, lng], {icon: ikona});
  marker.bindPopup("<div> " + ime + "</div><br><div>"+ ulica + " "+ broj + "</div>").openPopup();

  // Dodamo točko na mapo in v seznam
  marker.addTo(mapa);
  markerji.push(marker);
}


function izrisRezultatov(jsonRezultat) {
  
  var znacilnosti = jsonRezultat.features;

 while(znacilnosti.length != undefined) {
  for (var i = 0; i < znacilnosti.length; i++) {
    var jeObmocje = typeof(znacilnosti[i].geometry.coordinates[0]) == "object";
   
    var ime = znacilnosti[i].properties['name'];
    var ulica = znacilnosti[i].properties['addr:street'];
    var broj = znacilnosti[i].properties['addr:housenumber'];
    var lng = jeObmocje ? znacilnosti[i].geometry.coordinates[0][0][0] : 
      znacilnosti[i].geometry.coordinates[0];
    var lat = jeObmocje ? znacilnosti[i].geometry.coordinates[0][0][1] : 
      znacilnosti[i].geometry.coordinates[1];
    if (prikaziOznako(lng, lat))
      dodajMarker(lat, lng, ime, ulica, broj);
  }
  }
} 


function prikazPoti(latLng) {
 
  if (pot != null) mapa.removeControl(pot);
 if( document.getElementById("idDoNajblizje").checked) {
  pot= L.Routing.control({
    language: 'sl',
    waypoints: [
        L.latLng(LAT, LNG),
        L.latLng(latLng),
        ],
    
    lineOptions: {
      styles: [{color: '#242c81', weight: 12}]
      
    },
  
  }).addTo(mapa);
  } 
   //mapa.closePopup();
}


function prikaziOznako(lng, lat) {
  var radij = vrniRadij();
  if (radij == 0)
    return true;
  else if (distance(lat, lng, LAT, LNG, "K") >= radij) 
    return false;
  else
    return true;
}

function prikaziObmocje() {
  if (document.getElementById("idRadij").checked) {
    if (obmocje != null) mapa.removeLayer(obmocje);
   
    mapa.fitBounds(obmocje.getBounds());
    obmocje = L.polygon([LAT,LNG], {
      color: 'green',
      fillColor: 'green',
      fillOpacity: 0.10,
      radius: vrniRadij() * 1000
    }).addTo(mapa);
  } else if (obmocje != null) {
    mapa.removeLayer(obmocje);
  }
  
}


function vrniRadij() {
  var vrednost = document.getElementById("radij");
  if (vrednost == null) {
    vrednost = 0;
  } else {
    vrednost = parseInt(vrednost.value, 10);
    vrednost = isNaN(vrednost) ? 0 : vrednost;
  }
  return vrednost;
}