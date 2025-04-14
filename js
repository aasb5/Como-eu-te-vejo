const daysInYear = 365;
const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const timeline = document.querySelector(".timeline");
const marker = document.querySelector(".marker");
const tooltip = document.querySelector(".tooltip");
const images = document.querySelectorAll('.zodiac-image');

function dayToMonthDay(dayOfYear) {
  let dayCount = 0;
  for (let i = 0; i < daysInMonth.length; i++) {
    if (dayOfYear <= dayCount + daysInMonth[i]) {
      const day = dayOfYear - dayCount;
      return `${monthNames[i]} ${day}`;
    }
    dayCount += daysInMonth[i];
  }
  return "Dec 31";
}

function updateImage(day) {
  let matched = false;

  images.forEach(img => {
    const start = parseInt(img.dataset.start);
    const end = parseInt(img.dataset.end);
    const inRange = start <= end
      ? day >= start && day <= end
      : day >= start || day <= end;

    img.classList.toggle('active', inRange);
    if (inRange) matched = true;
  });

  if (!matched) {
    console.warn("No zodiac matched for day:", day);
  }
}

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

timeline.addEventListener('click', (e) => updateMarker(e.clientX));

let isDragging = false;

marker.addEventListener('mousedown', () => {
  isDragging = true;
  document.body.style.userSelect = 'none';
});

window.addEventListener('mouseup', () => {
  isDragging = false;
  document.body.style.userSelect = '';
});

window.addEventListener('mousemove', (e) => {
  if (isDragging) {
    updateMarker(e.clientX);
  }
});

window.onload = () => {
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 0);
  const diff = today - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  const percent = (dayOfYear - 1) / (daysInYear - 1);
  const positionX = percent * timeline.offsetWidth;

  marker.style.left = `${positionX}px`;
  tooltip.style.left = `${positionX}px`;
  tooltip.innerText = dayToMonthDay(dayOfYear);

  updateImage(dayOfYear);
};
