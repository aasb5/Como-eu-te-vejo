// Existing code...

let isDragging = false;

function updateMarker(positionX) {
  const rect = timeline.getBoundingClientRect();
  const clampedX = Math.min(Math.max(positionX - rect.left, 0), rect.width);
  const percent = clampedX / rect.width;
  const dayOfYear = Math.round(percent * (daysInYear - 1)) + 1;

  marker.style.left = `${clampedX}px`;
  tooltip.style.left = `${clampedX}px`;
  tooltip.innerText = dayToMonthDay(dayOfYear);

  updateImage(dayOfYear);
}

// Mouse events
timeline.addEventListener('click', (e) => updateMarker(e.clientX));

marker.addEventListener('mousedown', () => isDragging = true);
window.addEventListener('mouseup', () => isDragging = false);
window.addEventListener('mousemove', (e) => {
  if (isDragging) updateMarker(e.clientX);
});

// Touch events
timeline.addEventListener('touchstart', (e) => {
  e.preventDefault();  // Prevent scrolling
  const touch = e.touches[0];
  updateMarker(touch.clientX);
  isDragging = true;
});

window.addEventListener('touchend', () => {
  isDragging = false;
});

window.addEventListener('touchmove', (e) => {
  if (isDragging) {
    e.preventDefault();  // Prevent scrolling
    const touch = e.touches[0];
    updateMarker(touch.clientX);
  }
});

window.onload = () => {
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 0);
  const diff = today - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  const percent = (dayOfYear - 1) / (daysInYear - 1);
  marker.style.left = `${percent * timeline.offsetWidth}px`;
  tooltip.innerText = dayToMonthDay(dayOfYear);
  updateImage(dayOfYear);
};
