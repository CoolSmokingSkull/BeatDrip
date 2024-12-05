// modules/uiManager.js

export class UIManager {
  constructor(audioManager) {
    this.audioManager = audioManager;
    this.views = {
      'drum-pads-view': document.getElementById('drum-pads-view'),
      'sequencer-view': document.getElementById('sequencer-view'),
      'settings-view': document.getElementById('settings-view'),
      'lab-view': document.getElementById('lab-view'),
    };
    this.currentView = 'drum-pads-view';
  }

  showView(viewId) {
    for (let view in this.views) {
      if (view === viewId) {
        this.views[view].classList.add('active');
      } else {
        this.views[view].classList.remove('active');
      }
    }
    this.currentView = viewId;
    this.updateActiveTab(viewId);
  }

  updateActiveTab(viewId) {
    const tabs = ['drum-pads-tab', 'sequencer-tab', 'settings-tab', 'lab-tab'];
    tabs.forEach((tabId) => {
      const tab = document.getElementById(tabId);
      if (tabId.includes(viewId.split('-')[0])) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
  }

  adjustLayout() {
    // Implement responsive adjustments here
  }
}
