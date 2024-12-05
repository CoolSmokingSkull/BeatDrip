// app.js

import { initializeDrumPads } from './modules/pad.js';
import { initializeSettings } from './modules/settings.js';
import { initializeSequencer } from './modules/sequencer.js';
import { initializeLab } from './modules/lab.js';
import { AudioManager } from './modules/audioManager.js';
import { UIManager } from './modules/uiManager.js';
import { initializeBackgroundAnimation } from './modules/utils.js';

// Initialize Audio Context
window.AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

// Initialize Audio Manager
const audioManager = new AudioManager(audioContext);

// Initialize UI Manager
const uiManager = new UIManager(audioManager);

// Initialize Drum Pads View
initializeDrumPads(audioManager, uiManager);

// Initialize Settings View
initializeSettings(audioManager, uiManager);

// Initialize Sequencer View
initializeSequencer(audioManager, uiManager);

// Initialize Lab View
initializeLab(audioManager, uiManager);

// Initialize Background Animation
initializeBackgroundAnimation();

// Event Listeners for Tabs
document.getElementById('drum-pads-tab').addEventListener('click', () => {
  uiManager.showView('drum-pads-view');
});
document.getElementById('sequencer-tab').addEventListener('click', () => {
  uiManager.showView('sequencer-view');
});
document.getElementById('settings-tab').addEventListener('click', () => {
  uiManager.showView('settings-view');
});
document.getElementById('lab-tab').addEventListener('click', () => {
  uiManager.showView('lab-view');
});

// Fullscreen Toggle
const fullscreenButton = document.getElementById('fullscreen-button');
fullscreenButton.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
});

// Request Fullscreen on Load
document.addEventListener('DOMContentLoaded', () => {
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  }
});

// Handle orientation changes
window.addEventListener('orientationchange', () => {
  uiManager.adjustLayout();
});

// Initialize Particles.js
particlesJS.load('particles-js', 'assets/particles.json', function() {
  console.log('Particles.js config loaded');
});

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('service-worker.js').then(
      function (registration) {
        console.log('ServiceWorker registration successful with scope:', registration.scope);
      },
      function (err) {
        console.log('ServiceWorker registration failed:', err);
      }
    );
  });
}
