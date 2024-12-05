// app.js

import { initializeDrumPads } from './modules/pad.js';
import { initializeSettings } from './modules/settings.js';
import { AudioManager } from './modules/audioManager.js';
import { UIManager } from './modules/uiManager.js';
import { initializeBackgroundAnimation } from './modules/utils.js';

// Initialize Audio Context for optimized audio playback
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

// Initialize Background Animation
initializeBackgroundAnimation();

// Event Listeners for Tabs
document.getElementById('drum-pads-tab').addEventListener('click', () => {
  uiManager.showView('drum-pads-view');
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

// Handle orientation changes
window.addEventListener('orientationchange', () => {
  uiManager.adjustLayout();
});

// Register Service Worker for PWA functionality
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
