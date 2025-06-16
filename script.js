const modeSelect = document.getElementById("mode");
const keyInput = document.getElementById("key");
const inputText = document.getElementById("input");
const outputText = document.getElementById("output");

window.onload = () => {
  const lastMode = localStorage.getItem("lastMode");
  if (lastMode) modeSelect.value = lastMode;
};

modeSelect.onchange = () => {
  localStorage.setItem("lastMode", modeSelect.value);
};

function encrypt() {
  const mode = modeSelect.value;
  const key = keyInput.value;
  const text = inputText.value;

  let result = "";

  if (mode === "base64") {
    result = btoa(unescape(encodeURIComponent(text)));
  } else if (mode === "xor") {
    result = btoa([...text].map((c, i) => 
      String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
    ).join(""));
  } else if (mode === "caesar") {
    const shift = parseInt(key) || 0;
    result = [...text].map(c =>
      String.fromCharCode(c.charCodeAt(0) + shift)
    ).join("");
  } else if (mode === "mix") {
    const xor = [...text].map((c, i) => 
      String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
    ).join("");
    result = btoa(unescape(encodeURIComponent(xor)));
  }

  outputText.value = result;
}

function decrypt() {
  const mode = modeSelect.value;
  const key = keyInput.value;
  const text = inputText.value;

  let result = "";

  if (mode === "base64") {
    result = decodeURIComponent(escape(atob(text)));
  } else if (mode === "xor") {
    const decoded = atob(text);
    result = [...decoded].map((c, i) =>
      String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
    ).join("");
  } else if (mode === "caesar") {
    const shift = parseInt(key) || 0;
    result = [...text].map(c =>
      String.fromCharCode(c.charCodeAt(0) - shift)
    ).join("");
  } else if (mode === "mix") {
    const decoded = decodeURIComponent(escape(atob(text)));
    result = [...decoded].map((c, i) =>
      String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
    ).join("");
  }

  outputText.value = result;
}

function copyResult() {
  navigator.clipboard.writeText(outputText.value);
  alert("已複製到剪貼簿！");
}

// 粒子背景（簡單流動線條）
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = Array.from({ length: 80 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  dx: Math.random() - 0.5,
  dy: Math.random() - 0.5,
}));

function animate() {
  ctx.fillStyle = "rgba(0,0,0,0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#0f0";
  ctx.lineWidth = 0.5;
  particles.forEach(p => {
    p.x += p.dx;
    p.y += p.dy;

    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
    ctx.stroke();
  });

  requestAnimationFrame(animate);
}
animate();
