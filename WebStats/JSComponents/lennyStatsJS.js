this.lennyStats = (function (undefined) {
  this.sum = (function  (a, b) {
    return a+b;
  });
})();

var sc = statCall = {};
//var statCall = sc;
sc.sum2 = function (a, b) {
  return a+b;
}
sc.sum = function (a) {
  var value = 0;
  for (var i = 0; i < a.length; i ++) {
    value += a[i];
  }
  return value;
}
sc.sumSq = function (a) {
  var value = 0;
  for (var i = 0; i < a.length; i ++) {
    value += (a[i]*a[i]);
  }
  return value;
}
sc.mean = function (a) {
  var value = sc.sum(a);
  return (value / a.length);
}

sc.tTest = function (arrA, arrB) {
  var lengthA = arrA.length;
  var lengthB = arrB.length;
  var sumA = sc.sum(arrA);
  var sumB = sc.sum(arrB);
  // output(sumB);
  var sqA = sumA * sumA;
  var sqB = sumB * sumB;
  // output(sqB);
  var meanA = sumA/lengthA;
  var meanB = sumB/lengthB;
  // output(meanB);
  var sumSqA = sc.sumSq(arrA);
  var sumSqB = sc.sumSq(arrB);
  // output(sumSqB);

  var tOut = (meanA - meanB) / Math.sqrt(
    (
      ((sumSqA - (sqA/lengthA)) + (sumSqB - (sqB/lengthB)))/(lengthA+lengthB-2)
    ) * (
      (1/lengthA) + (1/lengthB)
    )
  );
  var df = lengthA-1 + lengthB-1;

  return {"t":tOut, "df":df};
}

function output(a) {
  console.log(a);
}
