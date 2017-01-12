/*
 * DarkSky API Key:
 * KEY:--: 4b1ee6307dd982ebe18d133acda9adf2
 *
 * TO DO
 * Put in DarkSky API
 * Call get location
 * Pipe location into DarkSky API Call
 * Get hourly forecasts for rest of day
 * Find a 3 hr stretch that has good weather
 * Give the time 1 hr before that time as a time to do laundry
 * Time should be 4 hrs before SUNSET (7pm)
 */


/* Geolocation
 * Call 'getLocation()'
 */

/* DarkSky */
/*
 * https://api.darksky.net/forecast/[key]/[latitude],[longitude],[time]
 */



/* End of DarkSky */

/* Geolocation */

var ALLOW_ALL_HOURS = true;

$( document ).ready(function() {
  var handler = function() {
    $( this ).css( "background-color", "grey" );
    $( this ).css( "cursor", "default" );
    $( this ).html( "Thinking..." );
    getLocation();
    $( '#mainquestion' ).unbind("click", handler);
  }

  $( '#mainquestion' ).bind("click", handler);

  // $( '#mainquestion' ).click(function() {
  //   $( this ).css( "background-color", "grey" );
  //   $( this ).html( "Thinking..." );
  //   getLocation();
  // });
});

function getLocation() {
  if (navigator.geolocation) {

    var hour = (new Date()).getHours();
    if (ALLOW_ALL_HOURS || hour <= 15) { // Default is 15 (3pm)
      navigator.geolocation.getCurrentPosition(success, error, options);
    } else {
      $( '#nobox' ).css( "background-color", "red" );

      var message = "Not enough time today!";
      $( '#mainquestion' ).html("Done");
      $( '#info' ).html(message);
      console.log(message);
      return;
    }

  } else {
    console.log("Geolocation is not supported by this brower.");
  }
}

var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

function success(pos) {
  var coords = pos.coords;
  var lat = coords.latitude;
  var long = coords.longitude;
  var acc = coords.accuracy;

  var locationResult = "";

  console.log('Your current position is:');
  console.log(`Latitude : ${lat}`);
  console.log(`Longitude: ${long}`);
  console.log(`More or less ${acc} meters.`);

  callDarkSky(lat, long);
  //processDSData();

  var googleMapURL = "http://maps-api-ssl.google.com/maps/api/geocode/json?latlng=";
  var googleMapURLSuffix = "&sensor=false";
  var googleMapRequest = googleMapURL + lat + "," + long + googleMapURLSuffix;
  console.log(googleMapRequest);
  /*loadJSON(googleMapRequest,
     function(data) {
       console.log(data);
       if (data['status'] == "OK") {
         locationResult = data['results'][1]['formatted_address'];
       } else {
         locationResult = "Try Again: An error occured with the Google Maps API.";
       }
       console.log("locationResultArea:", locationResult);
     },
     function(xhrError) {
       console.error("ERROR: " + xhrError);
       locationResult = "Try Again: An error occured with the HTTP Request.";
   });*/
};

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
};

function loadJSON(path, success, error) {
// In lieu of JSON's .get()!
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function()
  {
      if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
              if (success)
                  success(JSON.parse(xhr.responseText));
          } else {
              if (error)
                  error(xhr);
          }
      }
  };
  xhr.open("GET", path, true);
  xhr.send();
}

/*
function showPosition(position) {
  var googleMapURL = "http://maps-api-ssl.google.com/maps/api/geocode/json?latlng=";
  var googleMapURLSuffix = "&sensor=false";
  var googleMapRequest = googleMapURL + position.coords.latitude + "," + position.coords.longitude + googleMapURLSuffix;
  console.log(googleMapRequest);
  loadJSON(googleMapRequest,
     function(data) {
       console.log(data);
       if (data['status'] == "OK") {
         locationResult = data['results'][0]['formatted_address'];
       } else {
         locationResult = "Try Again: An error occured with the Google Maps API.";
       }
       console.log("locationResultInside:", locationResult);
       locInput.value = locationResult;
     },
     function(xhr) {
       console.error("ERROR: " + xhr);
       locationResult = "Try Again: An error occured with the HTTP Request.";
       locInput.value = locationResult;
   });
}

function showError(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      locationResult = "Please reload: User denied the request for Geolocation."
      console.log("locationResultInside:", locationResult);

      break;
    case error.POSITION_UNAVAILABLE:
      locationResult = "Location information is unavailable."
      break;
    case error.TIMEOUT:
      locationResult = "The request to get user location timed out."
      break;
    case error.UNKNOWN_ERROR:
      locationResult = "An unknown error occurred."
      break;
  }
  locInput.value = locationResult;
}

/* end of Geolocation */
