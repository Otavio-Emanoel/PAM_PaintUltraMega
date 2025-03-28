const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const inputColor = document.querySelector(".input__color");
const tools = document.querySelectorAll(".button__tool");
const sizeButtons = document.querySelectorAll(".button__size");
const buttonClear = document.querySelector(".button__clear");
const buttonSave = document.getElementById("button__save");

let brushSize = 20;
let isPainting = false;
let activeTool = "brush";

canvas.addEventListener('touchstart', function(e) {
    e.preventDefault();
});

canvas.addEventListener('touchend', function(e) {
    e.preventDefault();
});

inputColor.addEventListener("change", ({ target }) => {
    ctx.fillStyle = target.value;
});

canvas.addEventListener("mousedown", ({ clientX, clientY }) => {
    isPainting = true;

    if (activeTool == "brush") {
        draw(clientX, clientY);
    }

    if (activeTool == "rubber") {
        erase(clientX, clientY);
    }
});

canvas.addEventListener("mousemove", ({ clientX, clientY }) => {
    if (isPainting) {
        if (activeTool == "brush") {
            draw(clientX, clientY);
        }

        if (activeTool == "rubber") {
            erase(clientX, clientY);
        }
    }
});

canvas.addEventListener("mouseup", ({ clientX, clientY }) => {
    isPainting = false;
});

canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    isPainting = true;
    const touch = e.touches[0];
    const { clientX, clientY } = touch;
    if (activeTool === "brush") {
        draw(clientX, clientY);
    }
    if (activeTool === "rubber") {
        erase(clientX, clientY);
    }
});

canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const { clientX, clientY } = touch;
    if (isPainting) {
        if (activeTool === "brush") {
            draw(clientX, clientY);
        }
        if (activeTool === "rubber") {
            erase(clientX, clientY);
        }
    }
});

canvas.addEventListener("touchend", () => {
    isPainting = false;
});

const draw = (x, y) => {
    const rect = canvas.getBoundingClientRect();
    const drawX = x - rect.left;
    const drawY = y - rect.top;

    ctx.globalCompositeOperation = "source-over";
    ctx.beginPath();
    ctx.arc(drawX, drawY, brushSize / 2, 0, 2 * Math.PI);
    ctx.fill();
};

const erase = (x, y) => {
    const rect = canvas.getBoundingClientRect();
    const drawX = x - rect.left;
    const drawY = y - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(drawX, drawY, brushSize / 2, 0, 2 * Math.PI);
    ctx.fill();
};

const selectTool = ({ target }) => {
    const selectedTool = target.closest("button");
    const action = selectedTool.getAttribute("data-action");

    if (action) {
        tools.forEach((tool) => tool.classList.remove("active"));
        selectedTool.classList.add("active");
        activeTool = action;
    }
};

const selectSize = ({ target }) => {
    const selectedTool = target.closest("button");
    const size = parseInt(selectedTool.getAttribute("data-size"));

    sizeButtons.forEach((tool) => tool.classList.remove("active"));
    selectedTool.classList.add("active");
    brushSize = size;
};

tools.forEach((tool) => {
    tool.addEventListener("click", selectTool);
});

sizeButtons.forEach((button) => {
    button.addEventListener("click", selectSize);
});

buttonClear.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

buttonSave.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "drawing.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
});
