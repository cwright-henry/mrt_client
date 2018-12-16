const std = (values) => {
  var avg = mean(values);
  
  var squareDiffs = values.map(function(value){
    var diff = value - avg;
    var sqrDiff = diff * diff;
    return sqrDiff;
  });
  
  var avgSquareDiff = mean(squareDiffs);

  var stdDev = Math.sqrt(avgSquareDiff);
  return stdDev;
}

const mean = (data) => {
  let sum = 0
  for(let i = 0; i < data.length; i++) {
    sum += data[i][1]
  }
  return sum / data.length;
}

const gaussionData = (mean, std, bins) => {
  const data = [];

  for (let i = 0; i < bins.length; i++) {
    let x = bins[i][0];
    let y = (1 / (std * Math.sqrt(2 * Math.PI))) * (Math.exp(-0.5 * Math.pow((x - mean)/std, 2)));
    data.push([x, y]);
  }

  return data;
}

export {
  std,
  mean,
  gaussionData
}