// modules/pad.js

export function initializeDrumPads(audioManager, uiManager) {
    const drumPadsContainer = document.getElementById('drum-pads-container');
    const randomizeButton = document.getElementById('randomize-button');
    const slidingWindow = document.getElementById('sliding-window');
    const slidingWindowToggle = document.getElementById('sliding-window-toggle');
    const volumeSlider = document.getElementById('volume-slider');
    const pitchSlider = document.getElementById('pitch-slider');
  
    // Initialize default drum pads (4x4 grid)
    let gridSize = 4;
    createDrumPads(gridSize);
  
    // Randomize Sounds Button
    randomizeButton.addEventListener('click', () => {
      audioManager.randomizeSounds(gridSize * gridSize);
    });
  
    // Sliding Window Toggle
    slidingWindowToggle.addEventListener('click', () => {
      slidingWindow.classList.toggle('open');
    });
  
    // Volume Control
    volumeSlider.addEventListener('input', (e) => {
      audioManager.setGlobalVolume(e.target.value);
    });
  
    // Pitch Control
    pitchSlider.addEventListener('input', (e) => {
      audioManager.setGlobalPitch(e.target.value);
    });
  
    function createDrumPads(gridSize) {
      drumPadsContainer.innerHTML = ''; // Clear existing pads
      drumPadsContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
      drumPadsContainer.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
  
      for (let i = 0; i < gridSize * gridSize; i++) {
        const pad = document.createElement('div');
        pad.classList.add('drum-pad');
        pad.dataset.padIndex = i;
  
        // Visual Reaction on Touch
        pad.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          pad.classList.add('active');
          audioManager.playSound(i);
        });
  
        pad.addEventListener('pointerup', () => {
          pad.classList.remove('active');
        });
  
        pad.addEventListener('pointerleave', () => {
          pad.classList.remove('active');
        });
  
        drumPadsContainer.appendChild(pad);
      }
    }
  
    // Expose createDrumPads for external use
    uiManager.createDrumPads = createDrumPads;
    uiManager.currentGridSize = gridSize;
  }
  