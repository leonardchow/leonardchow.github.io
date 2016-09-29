var financeData = [
  ["239.65","24/02/2015","0.000128","-0.2379","47.044"],
  ["238.99","24/02/2015","0.0106","-0.2435","5.11"],
  ["231.26","24/02/2015","0.0066","-0.2521","7.571"],
  ["239.12","24/02/2015","0.0082","-0.2454","16.429"],
  ["255.07","24/02/2015","0.0091","-0.2017","252"],
  ["238.91","24/02/2015","0.0077","-0.2437","995"],
  ["211.51","24/02/2015","0.0089","-0.1880","4.28"],
  ["210.65","24/02/2015","0.0078","-0.1930","2.521"],
  ["205.06","24/02/2015","0.0107","-0.2251","96"],
  ["212.41","24/02/2015","0.0085","-0.1949","456"],
  ["227.94","24/02/2015","0.0158","-0.1363","49"],
  ["211.28","24/02/2015","0.0078","-0.1765","19"],
  ["1486.97","24/02/2015","0.0112","-0.2310","168"],
  ["1310.00","24/02/2015","-0.01812","-0.3310","0"],
  ["1497.50","24/02/2015","0.0051","-0.2309","160"]
];

var financeDataHeaders = ["Price", "Date", "1D Chg", "YTD Chg", "Vol BTC"];

var financeDataFormat = [
  {type: 'numeric', format: '$0,0.00'},
  {type: 'date', dateFormat: 'DD/MM/YYYY', correctFormat: true},
  {type: 'numeric', format: '0.00%'},
  {type: 'numeric', format: '0.00%'},
  {type: 'numeric', format: '0.00'}
];

var tTestData = [
  ["1", "3", "20"],
  ["2", "3", "13"],
  ["3", "3", "13"],
  ["4", "12", "20"],
  ["5", "15", "29"],
  ["6", "16", "32"],
  ["7", "17", "23"],
  ["8", "19", "20"],
  ["9", "23", "25"],
  ["10", "24", "15"],
  ["11", "32", "30"]
];

var tTestDataHeaders = ["Subject no", "Score 1", "Score 2"];

var tTestDataFormat = [
  {type: 'numeric', format: '0'},
  {type: 'numeric', format: '0'},
  {type: 'numeric', format: '0'}
];

var container = document.getElementById('example');

var hot = new Handsontable(container, {
  data: tTestData,
  colHeaders: tTestDataHeaders,
  rowHeaders: true,
  stretchH: 'none',
  sortIndicator: true,
  columnSorting: true,
  contextMenu: true,
  manualRowResize: true,
  manualColumnResize: true,
  columns: tTestDataFormat
});

function onLoad() {
  var tempStore = hot.getDataAtCol(1);
  //var tempArray = tempStore.slice(0, 6);
  for(var i=0; i<tempStore.length;i++) tempStore[i] = +tempStore[i];


  console.log(tempStore);
  jstat = jStat(tempStore);

  var mean = jstat.sum(jstat);

  console.log(mean);

  var tTestOut = jstat.ttest(mean, jstat, 1);

  var outputArea = document.getElementById("output");

  outputArea.innerHTML = tTestOut;

  // var myVect =  new Array(2,6,4,7,2,7,4);
  // jObj = jStat( myVect );
  // console.log(myVect);
  // console.log(jObj.mean());

}

//
// data[i]['cum'] = jstat.normal(jstat.mean(), jstat.stdev()).cdf(data[i].x);
