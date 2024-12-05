// modules/pad.js

export function initializeDrumPads(audioManager, uiManager) {
  const drumPadsContainer = document.getElementById('drum-pads-container');
  const randomizeButton = document.getElementById('randomize-button');
  const slidingWindow = document.getElementById('sliding-window');
  const slidingWindowToggle = document.getElementById('sliding-window-toggle');
  const volumeSlider = document.getElementById('volume-slider');
  const pitchSlider = document.getElementById('pitch-slider');
  const quantizeSelect = document.getElementById('quantize-select');
  const recordButton = document.getElementById('record-button');
  const playbackButton = document.getElementById('playback-button');
  const recordingTimer = document.getElementById('recording-timer');
  const metronomeIndicator = document.getElementById('metronome-indicator');

  // Initialize default drum pads (4x4 grid)
  let gridSize = 4;
  createDrumPads(gridSize);

  // Recording Variables
  let isRecording = false;
  let recordingStartTime = 0;
  let recordedEvents = [];
  let recordingInterval;

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

  // Quantization Selection
  quantizeSelect.addEventListener('change', (e) => {
    audioManager.setQuantization(e.target.value);
  });

  // Record Button
  recordButton.addEventListener('click', () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  });

  // Playback Button
  playbackButton.addEventListener('click', () => {
    playbackRecording();
  });

  function createDrumPads(gridSize) {
    drumPadsContainer.innerHTML = ''; // Clear existing pads
    drumPadsContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    drumPadsContainer.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

    for (let i = 0; i < gridSize * gridSize; i++) {
      const pad = document.createElement('div');
      pad.classList.add('drum-pad');
      pad.dataset.padIndex = i;

      // Pad Label
      const padLabel = document.createElement('span');
      padLabel.classList.add('pad-label');
      padLabel.textContent = `Pad ${i + 1}`;
      pad.appendChild(padLabel);

      // Visual Reaction on Touch
      pad.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        pad.classList.add('active');
        audioManager.playSound(i);

        if (isRecording) {
          const timestamp = audioManager.getCurrentTime() - recordingStartTime;
          recordedEvents.push({ padIndex: i, time: timestamp });
        }
      });

      pad.addEventListener('pointerup', () => {
        pad.classList.remove('active');
      });

      pad.addEventListener('pointerleave', () => {
        pad.classList.remove('active');
      });

      // Long Press for Color Picker
      let pressTimer;
      pad.addEventListener('pointerdown', (e) => {
        pressTimer = setTimeout(() => {
          openColorPicker(pad);
        }, 1000);
      });

      pad.addEventListener('pointerup', () => {
        clearTimeout(pressTimer);
      });

      pad.addEventListener('pointerleave', () => {
        clearTimeout(pressTimer);
      });

      drumPadsContainer.appendChild(pad);
    }
  }

  function startRecording() {
    isRecording = true;
    recordedEvents = [];
    recordingStartTime = audioManager.getCurrentTime();
    recordButton.classList.add('recording');
    playbackButton.disabled = true;
    updateRecordingTimer();
    recordingInterval = setInterval(updateRecordingTimer, 1000);
  }

  function stopRecording() {
    isRecording = false;
    recordButton.classList.remove('recording');
    playbackButton.disabled = false;
    clearInterval(recordingInterval);
    recordingTimer.textContent = '00:00';
  }

  function playbackRecording() {
    recordedEvents.forEach((event) => {
      setTimeout(() => {
        audioManager.playSound(event.padIndex);
      }, event.time * 1000);
    });
  }

  function updateRecordingTimer() {
    const elapsedTime = Math.floor(audioManager.getCurrentTime() - recordingStartTime);
    const minutes = String(Math.floor(elapsedTime / 60)).padStart(2, '0');
    const seconds = String(elapsedTime % 60).padStart(2, '0');
    recordingTimer.textContent = `${minutes}:${seconds}`;
  }

  function openColorPicker(pad) {
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.style.position = 'absolute';
    colorInput.style.left = '-9999px';
    document.body.appendChild(colorInput);

    colorInput.addEventListener('input', (e) => {
      pad.style.setProperty('--pad-color', e.target.value);
      pad.classList.add('custom-color');
    });

    colorInput.click();
    document.body.removeChild(colorInput);
  }

  // Expose createDrumPads for external use
  uiManager.createDrumPads = createDrumPads;
  uiManager.currentGridSize = gridSize;
}
