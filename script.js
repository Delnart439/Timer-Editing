let interval = null;
let elapsed = 0;
let target = 0;

const canvas = document.getElementById('timerCanvas');
const ctx = canvas.getContext('2d');

function formatTime(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  return `${m}:${s}`;
}

// Parse input as either seconds or mm:ss
function parseTargetTime(input) {
  if (input.includes(':')) {
    const [min, sec] = input.split(':').map(Number);
    if (isNaN(min) || isNaN(sec) || min < 0 || sec < 0 || sec > 59) return null;
    return min * 60 + sec;
  } else {
    const sec = parseInt(input, 10);
    if (isNaN(sec) || sec < 1) return null;
    return sec;
  }
}

function drawTimer(timeStr) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Responsive padding and radius
  const paddingX = canvas.width * 0.08;
  const paddingY = canvas.height * 0.17;
  const rectWidth = canvas.width - paddingX * 2;
  const rectHeight = canvas.height - paddingY * 2;
  const radius = Math.min(canvas.width, canvas.height) * 0.18;

  // Draw white rounded rectangle (filled)
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(paddingX + radius, paddingY);
  ctx.lineTo(paddingX + rectWidth - radius, paddingY);
  ctx.quadraticCurveTo(paddingX + rectWidth, paddingY, paddingX + rectWidth, paddingY + radius);
  ctx.lineTo(paddingX + rectWidth, paddingY + rectHeight - radius);
  ctx.quadraticCurveTo(paddingX + rectWidth, paddingY + rectHeight, paddingX + rectWidth - radius, paddingY + rectHeight);
  ctx.lineTo(paddingX + radius, paddingY + rectHeight);
  ctx.quadraticCurveTo(paddingX, paddingY + rectHeight, paddingX, paddingY + rectHeight - radius);
  ctx.lineTo(paddingX, paddingY + radius);
  ctx.quadraticCurveTo(paddingX, paddingY, paddingX + radius, paddingY);
  ctx.closePath();
  ctx.fillStyle = "#fff";
  ctx.fill();

  // Draw red contour
  ctx.lineWidth = Math.max(4, canvas.width * 0.02);
  ctx.strokeStyle = "#e53935";
  ctx.stroke();
  ctx.restore();

  // Responsive font and spacing (smaller for mobile)
  let fontSize = Math.round(canvas.height * 0.45); // smaller than before
  if (canvas.width < 350) fontSize = Math.round(canvas.height * 0.38); // even smaller for very small screens
  ctx.font = `bold ${fontSize}px 'Digital-7', 'Orbitron', 'DS-Digital', monospace`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#222";

  // Calculate total width with spacing
  const chars = timeStr.split('');
  const spacing = fontSize * 0.16; // smaller spacing
  let totalWidth = 0;
  const charWidths = chars.map(char => {
    const w = ctx.measureText(char).width;
    totalWidth += w;
    return w;
  });
  totalWidth += spacing * (chars.length - 1);

  // Start drawing from center
  let x = (canvas.width - totalWidth) / 2;
  const y = canvas.height / 2;

  chars.forEach((char, i) => {
    ctx.fillText(char, x, y);
    x += charWidths[i] + spacing;
  });
}

function drawTimerWithRecordingState(timeStr) {
  drawTimer(timeStr, false);
}

document.getElementById('startBtn').onclick = function() {
  const input = document.getElementById('targetTime').value.trim();
  target = parseTargetTime(input);
  if (!target) return;

  clearInterval(interval);
  elapsed = 0;
  drawTimerWithRecordingState(formatTime(0));

  interval = setInterval(() => {
    elapsed++;
    drawTimerWithRecordingState(formatTime(elapsed));
    if (elapsed >= target) {
      clearInterval(interval);
    }
  }, 1000);
};



function resizeCanvas() {
  const container = document.querySelector('.timer-container');
  const canvas = document.getElementById('timerCanvas');
  const width = Math.min(container.offsetWidth, 480);
  const height = Math.round(width * 180 / 480);
  canvas.width = width;
  canvas.height = height;
}
window.addEventListener('resize', () => {
  resizeCanvas();
  drawTimer(formatTime(elapsed || 0));
});
resizeCanvas();

// After all your variable declarations and function definitions, add this line:
drawTimer(formatTime(0));