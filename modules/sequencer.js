// modules/sequencer.js

export function initializeSequencer(audioManager, uiManager) {
    const sequencerContainer = document.getElementById('sequencer-container');
    const playButton = document.getElementById('sequencer-play-button');
    const stopButton = document.getElementById('sequencer-stop-button');
    const tempoInput = document.getElementById('sequencer-tempo');
  
    const gridRows = audioManager.sounds.length;
    const gridCols = 16; // Number of steps
    let isPlaying = false;
    let currentStep = 0;
    let sequence = createEmptySequence(gridRows, gridCols);
    let intervalId;
  
    // Create Sequencer Grid
    function createSequencerGrid() {
      sequencerContainer.innerHTML = '';
      sequencerContainer.style.display = 'grid';
      sequencerContainer.style.gridTemplateColumns = `repeat(${gridCols}, 1fr)`;
      sequencerContainer.style.gridTemplateRows = `repeat(${gridRows}, 1fr)`;
  
      for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridCols; col++) {
          const cell = document.createElement('div');
          cell.classList.add('sequencer-cell');
          cell.dataset.row = row;
          cell.dataset.col = col;
  
          cell.addEventListener('click', () => {
            sequence[row][col] = !sequence[row][col];
            cell.classList.toggle('active');
          });
  
          sequencerContainer.appendChild(cell);
        }
      }
    }
  
    function createEmptySequence(rows, cols) {
      const seq = [];
      for (let i = 0; i < rows; i++) {
        seq.push(new Array(cols).fill(false));
      }
      return seq;
    }
  
    function playSequence() {
      const tempo = parseInt(tempoInput.value);
      const interval = (60 / tempo) * 1000 / 4; // 16th notes
      currentStep = 0;
  
      intervalId = setInterval(() => {
        for (let row = 0; row < gridRows; row++) {
          if (sequence[row][currentStep]) {
            audioManager.playSound(row);
          }
        }
        highlightCurrentStep(currentStep);
        currentStep = (currentStep + 1) % gridCols;
      }, interval);
    }
  
    function stopSequence() {
      clearInterval(intervalId);
      clearStepHighlights();
      isPlaying = false;
    }
  
    function highlightCurrentStep(step) {
      clearStepHighlights();
      document.querySelectorAll(`.sequencer-cell[data-col='${step}']`).forEach((cell) => {
        cell.classList.add('current-step');
      });
    }
  
    function clearStepHighlights() {
      document.querySelectorAll('.sequencer-cell.current-step').forEach((cell) => {
        cell.classList.remove('current-step');
      });
    }
  
    playButton.addEventListener('click', () => {
      if (!isPlaying) {
        isPlaying = true;
        playSequence();
      }
    });
  
    stopButton.addEventListener('click', () => {
      stopSequence();
    });
  
    // Initialize the sequencer grid
    createSequencerGrid();
  }
  