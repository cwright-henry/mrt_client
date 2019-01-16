/**
 * There are interesting discussions on wether to use
 * imperative or functional programming here - hmmm look up the difference...
 */

const std = (arr) => {
  let avg = mean(arr), temp = [], sum = 0;
  
  // Note that the map incurs stack overhead dur the function call
  // Could use reduce which seems to be implemented using a while loop
  for (let i = 1, len=arr.length; i < len; i++) {
    temp.push(Math.pow(arr[i][1] - avg, 2))
  }
  for(let i = 0; i < temp.length; i++) {
    sum += temp[i]
  }

  return Math.sqrt(sum / temp.length);
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

const getMinMax = (arr) => {
  let min = arr[0][1], max = arr[0][1], v;

  for (let i = 1, len=arr.length; i < len; i++) {
    v = arr[i][1];
    min = (v < min) ? v : min;
    max = (v > max) ? v : max;
  }
  return [min, max]
}

const stats = (arr) => {
  let minMax = getMinMax(arr)
	return {
    min: minMax[0],
    max: minMax[1],
    std: std(arr),
    mean: mean(arr)
  }
}

export {
  std,
  mean,
  gaussionData,
  getMinMax,
  stats
}