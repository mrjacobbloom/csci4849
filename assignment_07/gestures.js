const gestureArea = document.querySelector('#gestureArea');
const gestureResult = document.querySelector('#gestureResult');

const CLICK_RADIUS = 6; // px
const DBLCLICK_TIMEOUT = 300; // ms

let prevGesture, gesture;

const CLICK_TYPES = [
  null,
  'Click',
  'Double Click',
  'Triple Click',
  'Quadruple Click',
  'Pentuple Click',
  'Sextuple Click',
  'Septuple Click',
  'Octuple Click',
  'Nonuple Click',
  'Decuple Click'
];

gestureArea.addEventListener('mousedown', e => {
  gesture = {
    mouse_down: true,
    start: [e.clientX, e.clientY]
  };
  e.preventDefault();
});

gestureArea.addEventListener('mouseup', e => {
  if(!gesture) return;
  e.preventDefault();
  gesture.mouse_down = false;
  gesture.end = [e.clientX, e.clientY];

  let dx = gesture.end[0] - gesture.start[0];
  let dy = gesture.end[1] - gesture.start[1];
  let radius = Math.sqrt(dx**2 + dy**2);

  if(radius < CLICK_RADIUS) {
    // If this click is right after another click, it's an n-tuple click
    // Thus the click count is its click count + 1
    // Otherwise 1
    if(prevGesture
      && Date.now() - prevGesture.time < DBLCLICK_TIMEOUT
      && Math.sqrt((prevGesture.end[0] - gesture.end[0])**2 + (prevGesture.end[1] - gesture.end[1])**2) < CLICK_RADIUS
    ) {
      gesture.clicks = 1 + (prevGesture.clicks || 0);
    } else {
      gesture.clicks = 1;
    }
    // We've got the 1st 10 click types named, after that they're numbered
    if(gesture.clicks < CLICK_TYPES.length) {
      gestureResult.textContent = CLICK_TYPES[gesture.clicks];
    } else {
      gestureResult.textContent = `${gesture.clicks}-tuple Click`;
    }
    prevGesture = gesture;
    prevGesture.time = Date.now();
    gesture = null;
  } else { // Bigger than the click radius, let's call it a swipe
    // Theta is the angle of the drag
    let theta = 57.32*Math.atan2(dy, dx);
    if(theta < 0) theta += 360;
    if(theta < 45 || theta > 315) { // diagonal qudrants to determine swipe direction
      gestureResult.textContent = 'Swipe right';
    } else if(theta < 135) {
      gestureResult.textContent = 'Swipe down';
    } else if(theta < 225) {
      gestureResult.textContent = 'Swipe left';
    } else {
      gestureResult.textContent = 'Swipe up';
    }
    gesture = prevGesture = null;
  }
});