// modules/audioManager.js

export class AudioManager {
    constructor(audioContext) {
      this.audioContext = audioContext;
      this.sounds = [];
      this.globalVolume = 0.5;
      this.globalPitch = 1;
      this.loadDefaultSounds();
    }
  
    async loadDefaultSounds() {
      // Load default sounds for each pad
      for (let i = 0; i < 16; i++) {
        const soundIndex = this.getSoundIndexForPad(i);
        const buffer = await this.loadSoundBuffer(`assets/sounds/sound${soundIndex}.wav`);
        this.sounds[i] = { buffer, volume: this.globalVolume, pitch: this.globalPitch };
      }
    }
  
    getSoundIndexForPad(padIndex) {
      // Map pad index to sound ranges
      if (padIndex === 0) {
        return this.getRandomInt(1, 14);
      } else if (padIndex === 1) {
        return this.getRandomInt(15, 26);
      }
      // Extend mappings as necessary
      else {
        return this.getRandomInt(1, 209);
      }
    }
  
    async loadSoundBuffer(url) {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      return await this.audioContext.decodeAudioData(arrayBuffer);
    }
  
    playSound(padIndex) {
      const sound = this.sounds[padIndex];
      if (sound && sound.buffer) {
        const source = this.audioContext.createBufferSource();
        source.buffer = sound.buffer;
  
        // Apply pitch
        source.playbackRate.value = sound.pitch;
  
        // Create gain node for volume control
        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = sound.volume;
  
        source.connect(gainNode).connect(this.audioContext.destination);
        source.start(0);
      }
    }
  
    async randomizeSounds(numPads) {
      this.sounds = [];
      for (let i = 0; i < numPads; i++) {
        const soundIndex = this.getSoundIndexForPad(i);
        const buffer = await this.loadSoundBuffer(`assets/sounds/sound${soundIndex}.wav`);
        this.sounds[i] = { buffer, volume: this.globalVolume, pitch: this.globalPitch };
      }
    }
  
    setGlobalVolume(volume) {
      this.globalVolume = volume;
      this.sounds.forEach((sound) => {
        if (sound) {
          sound.volume = volume;
        }
      });
    }
  
    setGlobalPitch(pitch) {
      this.globalPitch = pitch;
      this.sounds.forEach((sound) => {
        if (sound) {
          sound.pitch = pitch;
        }
      });
    }
  
    getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  }
  