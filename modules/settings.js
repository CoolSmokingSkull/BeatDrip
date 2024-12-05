// modules/settings.js

export function initializeSettings(audioManager, uiManager) {
  const padSetupSelect = document.getElementById('pad-setup-select');
  const colorThemeSelect = document.getElementById('color-theme-select');
  const primaryColorPicker = document.getElementById('primary-color-picker');
  const secondaryColorPicker = document.getElementById('secondary-color-picker');
  const settingsDrumPadsContainer = document.getElementById('settings-drum-pads-container');
  const soundList = document.getElementById('sound-list');
  const soundSearch = document.getElementById('sound-search');
  const uploadSoundButton = document.getElementById('upload-sound-button');
  let selectedPadIndex = null;

  // Initialize pad grid in settings
  createSettingsDrumPads(uiManager.currentGridSize);

  padSetupSelect.addEventListener('change', (e) => {
    const gridSize = parseInt(e.target.value.split('x')[0]);
    uiManager.createDrumPads(gridSize);
    audioManager.randomizeSounds(gridSize * gridSize);
    createSettingsDrumPads(gridSize);
  });

  colorThemeSelect.addEventListener('change', (e) => {
    document.body.className = e.target.value;
  });

  primaryColorPicker.addEventListener('input', (e) => {
    document.documentElement.style.setProperty('--primary-color', e.target.value);
  });

  secondaryColorPicker.addEventListener('input', (e) => {
    document.documentElement.style.setProperty('--secondary-color', e.target.value);
  });

  // Sound selection
  soundSearch.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    populateSoundList(query);
  });

  soundList.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI' && selectedPadIndex !== null) {
      const soundIndex = e.target.dataset.soundIndex;
      assignSoundToPad(selectedPadIndex, soundIndex);
    }
  });

  uploadSoundButton.addEventListener('click', () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'audio/*';
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file && selectedPadIndex !== null) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          audioManager.loadSoundBuffer(ev.target.result).then((buffer) => {
            audioManager.sounds[selectedPadIndex] = { buffer, volume: audioManager.globalVolume, pitch: audioManager.globalPitch };
          });
        };
        reader.readAsArrayBuffer(file);
      }
    };
    fileInput.click();
  });

  function createSettingsDrumPads(gridSize) {
    settingsDrumPadsContainer.innerHTML = '';
    settingsDrumPadsContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    settingsDrumPadsContainer.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

    for (let i = 0; i < gridSize * gridSize; i++) {
      const pad = document.createElement('div');
      pad.classList.add('settings-drum-pad');
      pad.dataset.padIndex = i;

      pad.addEventListener('click', () => {
        document.querySelectorAll('.settings-drum-pad').forEach((p) => p.classList.remove('selected'));
        pad.classList.add('selected');
        selectedPadIndex = i;
      });

      settingsDrumPadsContainer.appendChild(pad);
    }
  }

  function populateSoundList(query) {
    soundList.innerHTML = '';
    for (let i = 1; i <= 209; i++) {
      const soundName = `Sound ${i}`;
      if (!query || soundName.toLowerCase().includes(query)) {
        const li = document.createElement('li');
        li.textContent = soundName;
        li.dataset.soundIndex = i;
        soundList.appendChild(li);
      }
    }
  }

  function assignSoundToPad(padIndex, soundIndex) {
    audioManager.loadSoundBuffer(`assets/sounds/sound${soundIndex}.wav`).then((buffer) => {
      audioManager.sounds[padIndex] = { buffer, volume: audioManager.globalVolume, pitch: audioManager.globalPitch };
    });
  }

  // Initial population of sound list
  populateSoundList();
}
