let grid;
let cols, rows;
let cellSize = 20;
let isAnimating = true;

function setup() {
  let homeContainer = document.querySelector('.home-container');
  // Fallback to document.body if .home-container isn't found
  if (!homeContainer) {
    homeContainer = document.body;
  }
  
  let canvas = createCanvas(homeContainer.offsetWidth, homeContainer.offsetHeight);
  canvas.position(homeContainer.offsetLeft, homeContainer.offsetTop);
  // You can remove the z-index style if it causes issues, but keeping it for now
  canvas.style('z-index', '-1');
  
  cols = floor(width / cellSize);
  rows = floor(height / cellSize);
  grid = make2DArray(cols, rows);
  resetToGliders();
  frameRate(10); // Adjust for a pleasing speed

  const toggleButton = document.getElementById('toggle-animation');
  if (toggleButton) {
    toggleButton.addEventListener('mousedown', toggleAnimation);
  } else {
    console.error("Element with id 'toggle-animation' not found!");
  }
}

function draw() {
  clear();
  stroke(200);
  for (let x = 0; x < width; x += cellSize) {
    for (let y = 0; y < height; y += cellSize) {
      line(x, 0, x, height);
      line(0, y, width, y);
    }
  }

  // Draw the current grid
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * cellSize;
      let y = j * cellSize;
      if (grid[i][j] === 1) {
        fill(0);
      } else {
        fill(255);
      }
      stroke(200);
      rect(x, y, cellSize, cellSize);
    }
  }

  // Compute the next generation
  if (isAnimating) {
    let next = make2DArray(cols, rows);
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let state = grid[i][j];
        // Count live neighbors
        let liveNeighbors = 0;
        for (let xoff = -1; xoff <= 1; xoff++) {
          for (let yoff = -1; yoff <= 1; yoff++) {
            if (xoff === 0 && yoff === 0) continue;
            let col = (i + xoff + cols) % cols;
            let row = (j + yoff + rows) % rows;
            liveNeighbors += grid[col][row];
          }
        }
        // Apply Game of Life rules:
        if (state === 1 && (liveNeighbors < 2 || liveNeighbors > 3)) {
          next[i][j] = 0;
        } else if (state === 0 && liveNeighbors === 3) {
          next[i][j] = 1;
        } else {
          next[i][j] = state;
        }
      }
    }

    grid = next;

    // If there are no live cells, reset the grid with multiple gliders
    let liveCount = 0;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        if (grid[i][j] === 1) liveCount++;
      }
    }
    if (liveCount === 0) {
      resetToGliders();
    }
  }
}

function windowResized() {
  let homeContainer = document.querySelector('.home-container');
  if (!homeContainer) {
    homeContainer = document.body;
  }
  resizeCanvas(homeContainer.offsetWidth, homeContainer.offsetHeight);
  cols = floor(width / cellSize);
  rows = floor(height / cellSize);
  grid = make2DArray(cols, rows);
  resetToGliders();
}

// Utility function to create a 2D array
function make2DArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < cols; i++) {
    arr[i] = new Array(rows).fill(0);
  }
  return arr;
}

// Reset the grid and place multiple gliders
function resetToGliders() {
  grid = make2DArray(cols, rows);
  let numberOfGliders = 10; // Adjust as needed
  for (let n = 0; n < numberOfGliders; n++) {
    let x = floor(random(cols - 3));
    let y = floor(random(rows - 3));
    addGlider(x, y);
  }
}

// Add a single glider at position (x, y)
// Glider pattern:
//   . X .
//   . . X
//   X X X
function addGlider(x, y) {
  grid[x + 1][y] = 1;
  grid[x + 2][y + 1] = 1;
  grid[x][y + 2] = 1;
  grid[x + 1][y + 2] = 1;
  grid[x + 2][y + 2] = 1;
}

// Toggle animation and switch icon
function toggleAnimation() {
  isAnimating = !isAnimating;
  let icon = document.getElementById('toggle-icon');
  if (icon) {
    if (isAnimating) {
      icon.src = './pause-button.png'; // Placeholder for pause icon
    } else {
      icon.src = './play-button.png'; // Placeholder for play icon
    }
  }
}

// Add a dot on mouse press
function mousePressed() {
  if (!isAnimating) {
    toggleDot();
  }
}

// Add a dot on mouse drag
function mouseDragged() {
  if (!isAnimating) {
    toggleDot();
  }
}

// Function to toggle a dot at the current mouse position
function toggleDot() {
  let i = floor(mouseX / cellSize);
  let j = floor(mouseY / cellSize);
  if (i >= 0 && i < cols && j >= 0 && j < rows) {
    grid[i][j] = grid[i][j] === 1 ? 0 : 1;
  }
}

console.log('loaded');

// Expose p5.js lifecycle functions to the global window so that p5.js can find them:
window.setup = setup;
window.draw = draw;
window.mousePressed = mousePressed;
window.mouseDragged = mouseDragged;
window.windowResized = windowResized;
window.toggleAnimation = toggleAnimation;
