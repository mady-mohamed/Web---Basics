const canvas = document.getElementById("pipeline-canvas");
const ctx = canvas.getContext("2d");
let width = 0;
let height = 0;
let particles = [];

const labels = ["scrape", "clean", "embed", "cluster", "dashboard"];
const colors = ["#0f766e", "#d95d39", "#2563eb", "#f4a261", "#14213d"];

function resize() {
  const rect = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  width = rect.width;
  height = rect.height;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  particles = Array.from({ length: Math.max(28, Math.floor(width / 35)) }, (_, index) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: 0.25 + Math.random() * 0.65,
    phase: Math.random() * Math.PI * 2,
    size: 2 + Math.random() * 4,
    color: colors[index % colors.length]
  }));
}

function drawNodes(time) {
  const top = height * 0.22;
  const bottom = height * 0.72;
  const start = width * 0.12;
  const end = width * 0.88;
  const step = (end - start) / (labels.length - 1);

  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(20, 33, 61, 0.16)";
  ctx.beginPath();
  labels.forEach((_, index) => {
    const x = start + step * index;
    const y = index % 2 === 0 ? top : bottom;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  labels.forEach((label, index) => {
    const x = start + step * index;
    const y = index % 2 === 0 ? top : bottom;
    const pulse = Math.sin(time / 600 + index) * 4;
    ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
    ctx.strokeStyle = colors[index];
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, 34 + pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#14213d";
    ctx.font = "700 12px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(label, x, y + 4);
  });
}

function drawParticles(time) {
  particles.forEach((particle) => {
    particle.x += particle.vx;
    particle.y += Math.sin(time / 900 + particle.phase) * 0.35;
    if (particle.x > width + 20) {
      particle.x = -20;
      particle.y = Math.random() * height;
    }

    ctx.fillStyle = particle.color;
    ctx.globalAlpha = 0.18;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  });
}

function animate(time) {
  ctx.clearRect(0, 0, width, height);
  drawParticles(time);
  if (width >= 700) {
    drawNodes(time);
  }
  requestAnimationFrame(animate);
}

window.addEventListener("resize", resize);
resize();
requestAnimationFrame(animate);
