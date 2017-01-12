function callDarkSky(lat, long) {

  var darkSkyURL = "https://api.darksky.net/forecast";
  var darkSkyKey = "4b1ee6307dd982ebe18d133acda9adf2";
  var darkSkyCoords = lat + "," + long;
  var darkSkyRequest = darkSkyURL + "/" + darkSkyKey + "/" + darkSkyCoords;
  console.log(darkSkyRequest);

  /*
  loadJSON(darkSkyRequest,
            function(data) {
              console.log(data);
              processDSData(data);
            },
            function(xhrError) {
              console.log(xhrError);
            });

  */

  $.ajax({
    url: darkSkyRequest,
    dataType: "jsonp",
    success: function (data) {
        console.log(data);
        processDSData(data);
    },
    error: function (xhrError) {
        console.log(xhrError);
    }
  });
}

function processDSData(DSdata) {
  var date = new Date();
  var timeNow = date.getTime()/1000|0;
  console.log("UNIX time now:" + timeNow);
  var hour = date.getHours();
  console.log("Current hour:" + hour);

  var hourlyArr = DSdata['hourly']['data'];
  console.log(hourlyArr);

  var time1 = hourlyArr[0]['time'];
  var newTime = new Date(time1*1000);
  //console.log(newTime.getHours());

  var hourCount = 0;
  var clearStretch = 0;
  var hourStart = -1;

  for (var i = 0; i < 12; i++) {
    var time = hourlyArr[i]['time'];
    var hours = (new Date(time*1000)).getHours();
    console.log(hours);
    if (hours >= 19 && !ALLOW_ALL_HOURS) { // Stop if you get to 7pm
      hourCount = i;
      break;
    }

    // Look at chance of rain & cloud cover (both 0-1)
    var precip = hourlyArr[i]['precipProbability'];
    var cloudCover = hourlyArr[i]['cloudCover'];

    console.log(`precip: ${precip}; cloudCover: ${cloudCover}.`);
    if (precip < 0.2 && cloudCover < 0.6) {
      clearStretch++;
      console.log(`clearStretch++ to : ${clearStretch}`);
    } else {
      clearStretch = 0;
    }

    if (clearStretch >= 3) {
      if (i > 3) {
        hourStart = i - 4;
        break;
      }
    }

  }

  var message = "";

  if (hourStart >= 0) {
    $( '#yesbox' ).css( "background-color", "red" );

    if (hourStart == 0) {
      message = "You can start right now! It'll be clear for another 4 hours.";
    } else if (hourStart == 1) {
      message = "You can start an hour from now! It'll be clear for 4 hours after that.";
    } else {
      message = `You can start ${hourStart} hours from now! It'll be clear for 4 hours after that.`;
    }
  } else {

    $( '#nobox' ).css( "background-color", "red" );
    message = "Nah there won't be enough sunlight, try again tomorrow!";
  }

  console.log(message);
  $( '#mainquestion' ).html("Done");
  $( '#info' ).html(message);

  // console.log(hourCount);
  // if (hourCount < 3) {
  //   console.log("Not today!");
  // }

}
