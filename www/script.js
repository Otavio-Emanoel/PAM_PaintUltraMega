const canvas = document.getElementById('drawCanvas');
const ctx = canvas.getContext('2d');
const clearBtn = document.getElementById('clearBtn');
const colorPicker = document.getElementById('colorPicker');
const thicknessSlider = document.getElementById('thicknessSlider');
const saveBtn = document.getElementById('saveBtn');

// Configuração inicial do canvas
function initializeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = 400;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = colorPicker.value;
    ctx.lineWidth = thicknessSlider.value;
}

initializeCanvas();

// Eventos de toque para desenho
let isDrawing = false;
let lastX = 0;
let lastY = 0;

canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('touchend', stopDrawing);

// Eventos de mouse para desktop
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = getCoordinates(e);
}

function draw(e) {
    if (!isDrawing) return;
    const x = getCoordinates(e)[0];
    const y = getCoordinates(e)[1];
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    [lastX, lastY] = [x, y];
}

function stopDrawing() {
    isDrawing = false;
}

function getCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    if (e.type === 'touchmove' || e.type === 'touchstart') {
        const touch = e.touches[0];
        return [
            (touch.clientX - rect.left) * scaleX,
            (touch.clientY - rect.top) * scaleY
        ];
    } else {
        return [
            (e.clientX - rect.left) * scaleX,
            (e.clientY - rect.top) * scaleY
        ];
    }
}

// Controles
clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

colorPicker.addEventListener('input', () => {
    ctx.strokeStyle = colorPicker.value;
});

thicknessSlider.addEventListener('input', () => {
    ctx.lineWidth = thicknessSlider.value;
});

saveBtn.addEventListener('click', () => {
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'desenho.png';
    link.href = dataUrl;
    link.click();
});

// Redimensionamento do canvas
window.addEventListener('resize', initializeCanvas);
