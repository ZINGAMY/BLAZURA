// === GALLERY CAROUSEL ===
(() => {
  const track = document.querySelector('.carousel-track');
  if (!track) return;
  const items = document.querySelectorAll('.carousel-item');
  let index = 0;
  let auto;
  const gap = 20;

  items.forEach(item => {
    const clone = item.cloneNode(true);
    track.appendChild(clone);
  });

  function slide() {
    index++;
    track.style.transition = 'transform 0.6s ease';
    track.style.transform = `translateX(-${index * (items[0].offsetWidth + gap)}px)`;
    if (index >= items.length) {
      setTimeout(() => {
        track.style.transition = 'none';
        track.style.transform = 'translateX(0)';
        index = 0;
      }, 600);
    }
  }

  function start() { auto = setInterval(slide, 3000); }
  function stop() { clearInterval(auto); }

  track.parentElement.addEventListener('mouseenter', stop);
  track.parentElement.addEventListener('mouseleave', start);
  start();
})();

// === ARC CAROUSEL ===
(() => {
  const arc = document.getElementById('arc');
  if (!arc) return;
  const photos = arc.querySelectorAll('.photo');
  const count = photos.length;
  const radius = 140;

  photos.forEach((photo, i) => {
    const angle = (Math.PI / (count - 1)) * i;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    photo.style.transform = `translate(${x}px, ${-y}px) rotate(${angle}rad)`;
  });
})();

// === COLOR WHEEL ===
(() => {
  const hueCanvas = document.getElementById("hueCanvas");
  const svCanvas = document.getElementById("svCanvas");
  const colorSample = document.getElementById("colorSample");
  const hexVal = document.getElementById("hexVal");
  const rgbVal = document.getElementById("rgbVal");

  if (!hueCanvas || !svCanvas) return;

  const hueCtx = hueCanvas.getContext("2d");
  const svCtx = svCanvas.getContext("2d");
  const hueRadius = hueCanvas.width / 2;
  const svRadius = svCanvas.width / 2;

  function drawHue() {
    for (let i = 0; i < 360; i++) {
      hueCtx.beginPath();
      hueCtx.strokeStyle = `hsl(${i}, 100%, 50%)`;
      hueCtx.arc(hueRadius, hueRadius, hueRadius - 10, (i - 1) * Math.PI / 180, i * Math.PI / 180);
      hueCtx.stroke();
    }
  }

  let hue = 0, saturation = 100, value = 100;

  function drawSV() {
    const grd = svCtx.createLinearGradient(0, 0, svCanvas.width, 0);
    grd.addColorStop(0, `hsl(${hue}, 0%, 100%)`);
    grd.addColorStop(1, `hsl(${hue}, 100%, 50%)`);
    svCtx.fillStyle = grd;
    svCtx.fillRect(0, 0, svCanvas.width, svCanvas.height);

    const grd2 = svCtx.createLinearGradient(0, 0, 0, svCanvas.height);
    grd2.addColorStop(0, "rgba(0,0,0,0)");
    grd2.addColorStop(1, "#000");
    svCtx.fillStyle = grd2;
    svCtx.fillRect(0, 0, svCanvas.width, svCanvas.height);
  }

  function updateColor() {
    const rgb = hsvToRgb(hue, saturation / 100, value / 100);
    const hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
    colorSample.style.background = hex;
    hexVal.textContent = hex;
    rgbVal.textContent = `${rgb[0]}, ${rgb[1]}, ${rgb[2]}`;
  }

  function hsvToRgb(h, s, v) {
    let f = (n, k = (n + h / 60) % 6) =>
      v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
    return [255 * f(5), 255 * f(3), 255 * f(1)];
  }

  function rgbToHex(r, g, b) {
    return (
      "#" +
      [r, g, b]
        .map(x => Math.round(x).toString(16).padStart(2, "0"))
        .join("")
    );
  }

  drawHue();
  drawSV();
  updateColor();
})();
