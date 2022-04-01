// Points for fingers
const fingerJoints = {
  thumb: [0, 1, 2, 3, 4],
  indexFinger: [0, 5, 6, 7, 8],
  middleFinger: [0, 9, 10, 11, 12],
  ringFinger: [0, 13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20],
};

// Infinity Gauntlet Style
const style = {
  0: { color: "yellow", size: 15 },
  1: { color: "gold", size: 6 },
  2: { color: "green", size: 10 },
  3: { color: "gold", size: 6 },
  4: { color: "gold", size: 6 },
  5: { color: "purple", size: 10 },
  6: { color: "gold", size: 6 },
  7: { color: "gold", size: 6 },
  8: { color: "gold", size: 6 },
  9: { color: "blue", size: 10 },
  10: { color: "gold", size: 6 },
  11: { color: "gold", size: 6 },
  12: { color: "gold", size: 6 },
  13: { color: "red", size: 10 },
  14: { color: "gold", size: 6 },
  15: { color: "gold", size: 6 },
  16: { color: "gold", size: 6 },
  17: { color: "orange", size: 10 },
  18: { color: "gold", size: 6 },
  19: { color: "gold", size: 6 },
  20: { color: "gold", size: 6 },
};

// Drawing function
export const drawHand = (predictions, ctx) => {
  // Check if we have predictions
  if (predictions.length > 0) {
    // Loop through each prediction
    predictions.forEach((prediction) => {
      if(prediction.label !== 'face'){
        let {bbox} = prediction;
        ctx.beginPath();
        ctx.rect(bbox[0], bbox[1], bbox[2], bbox[3]);
        ctx.stroke();
        // Get x point
        const x = bbox[0] + bbox[2]/2;
        // Get y point
        const y = bbox[1] + bbox[3]/2;
        // Start drawing
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, 3 * Math.PI);

        // Set line color
        ctx.fillStyle = 'blue';
        ctx.fill();
      }
    })
  }
};

export const isHandClosed = (predictions) => {
  let result = 0;
  if (predictions.length > 0) {
    let landmarks = predictions[0].landmarks;
    let x1 = landmarks[0][0];
    let y1 = landmarks[0][1];
    
    let x2 = landmarks[8][0];
    let y2 = landmarks[8][1];
    let x3 = landmarks[12][0];
    let y3 = landmarks[12][1];
    let x4 = landmarks[16][0];
    let y4 = landmarks[16][1];
    let x5 = landmarks[20][0];
    let y5 = landmarks[20][1];
    
    let y_index = x2 - x1;
    let x_index = y2 - y1;
    let y_middle = x3 - x1;
    let x_middle = y3 - y1;
    let y_ring = x4 - x1;
    let x_ring = y4 - y1;
    let y_pinky = x5 - x1;
    let x_pinky = y5 - y1;
    
    let dist_index = Math.sqrt(x_index * x_index + y_index * y_index);
    let dist_middle = Math.sqrt(x_middle * x_middle + y_middle * y_middle);
    let dist_ring = Math.sqrt(x_ring * x_ring + y_ring * y_ring);
    let dist_pinky = Math.sqrt(x_pinky * x_pinky + y_pinky * y_pinky);


    if(
      dist_index <= 150 &&
      dist_middle <= 150 &&
      dist_ring <= 150 &&
      dist_pinky <= 150
    )
      result = x1;
    else 
      result = 0;
  }
  return result;
}