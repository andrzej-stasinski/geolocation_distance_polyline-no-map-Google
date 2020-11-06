

// Obliczenie odleglosci
// ---------------------
function oblicz(a,b,c,d) {
    console.log('oblicz');

    var lat1 = a;
    var lng1 = b;
    var lat2 = c;
    var lng2 = d;
    console.log('Punkt A. lat (latitude=szer) ='+lat1 + 'lng (longitude=dlugosc) = '+lng1);
    console.log('Punkt B. lat (latitude=szer) ='+lat2 + 'lng (longitude=dlugosc) = '+lng2);

    var pi = Math.PI;
    var pi80 = pi/180;

    lat1 = lat1 * pi80;
    lng1 = lng1 * pi80;
    lat2 = lat2 * pi80;
    lng2 = lng2 * pi80;

    var r = 6372.797; // mean radius of Earth in km
    var dlat = lat2 - lat1;
    var dlng = lng2 - lng1;
    var a = Math.sin(dlat / 2) * Math.sin(dlat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlng / 2) * Math.sin(dlng / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var km =  r * c;
    console.log('Odleglosc w km = '+km);

    var km_round = km;

    function Round(n, k)     {
        var factor = Math.pow(10, k);
        return Math.round(n*factor)/factor;
    }

    km_round = km.toFixed(3);
    km_round = km_round + ' km';

    wynik.innerHTML = km_round;
}

// Polyline create - for click
// --------
function polyline(map, lat1, lng1, lat2, lng2) {
    //Polylines remove
    if(flightPath != null) {
        console.log('flightPath');
        polyline_remove();
    }

    flightCoords = [
        new google.maps.LatLng(lat1, lng1), 
        new google.maps.LatLng(lat2, lng2)
    ];

    flightPath = new google.maps.Polyline({
        path: flightCoords,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    flightPath.setMap(map); 
}

// Polyline remove - for click
// --------
function polyline_remove() {
    console.log('polyline_remove');
    flightPath.setMap(null);
}

// map, click - get position
// -------------------------
function initMap() {
    var counter = 0;

    var Warsaw = new google.maps.LatLng(54.230099, 18.012165);
    var mapOptions = {
        zoom: 7,
        center: Warsaw,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    map.setOptions({draggableCursor:'crosshair'});

    // click na mape - get koordynaty
    // -----
    google.maps.event.addListener(map, 'click', function(event) {

        counter++;
        licznik = counter % 2;

        console.log('counter='+counter+' licznik='+licznik);
        if(licznik == 1) {
            // Punkt A
            // -------

            console.log('START');
            lat1 = event.latLng.lat();
            lng1 = event.latLng.lng();

            // input get
            lat_a.value = lat1;
            lng_a.value = lng1;

            // zerowanie lat long dla Punku B
            lat_b.value = '';
            lng_b.value= '';
            lat2 = 0;
            lng2 = 0;

            //Polylines remove
            if(flightPath != null) {
                console.log('flightPath');
                polyline_remove();
            }
            
        } else {
            // Punkt B
            // -------

            console.log('END');
            lat2 = event.latLng.lat();
            lng2 = event.latLng.lng();

            // input get
            lat_b.value = lat2;
            lng_b.value = lng2;

            //Polylines create
            polyline(map, lat1, lng1, lat2, lng2);

            // oblicz
            oblicz(lat1, lng1, lat2, lng2);
                                                    
        }
        console.log('A lat1='+lat1 + ' , ' + 'lng1='+lng1);
        console.log('B lat2='+lat2 + ' , ' + 'lng2='+lng2);
    });
}

function pobierz() {
    var lat_a = document.getElementById('lat_a').value;
    var lng_a = document.getElementById('lng_a').value;
    var lat_b = document.getElementById('lat_b').value;
    var lng_b = document.getElementById('lng_b').value;

    if(lat_a == '' || lng_a == '' || lat_b == '' || lng_b == '') {
        console.log('puste pole');
        alert('Nie wypełnione pola');
    } else {

    polyline(map, lat_a, lng_a, lat_b, lng_b);

    oblicz(lat_a, lng_a, lat_b, lng_b);                
    }
}

// start
// -----
// lat=lng = 0, reset input
// button - click
function start() {
    console.log('start');
    var lat1 = lng1 = lat2 = lng2 = 0;
    map = null;
    window.flightPath = null;            
    initMap();

    var lat_a = document.getElementById('lat_a').value ='';
    var lng_a = document.getElementById('lng_a').value ='';
    var lat_b = document.getElementById('lat_b').value ='';
    var lng_b = document.getElementById('lng_b').value ='';
    var wynik = document.getElementById('wynik');

    var button = document.getElementById('button');
    var reset = document.getElementById('reset');

    reset.addEventListener('click', function() {

        const lat_a = document.getElementById('lat_a');
        lat_a.value = '';
        const lng_a = document.getElementById('lng_a');
        lng_a.value = '';
        const lat_b = document.getElementById('lat_b');
        lat_b.value = '';
        const lng_b = document.getElementById('lng_b');
        lng_b.value = '';

    })

    button.addEventListener('click', function() {
        pobierz();
    });            
}

window.onload = start;



