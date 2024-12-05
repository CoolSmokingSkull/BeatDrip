// modules/audioManager.js

export class AudioManager {
  constructor(audioContext) {
    this.audioContext = audioContext;
    this.sounds = [];
    this.globalVolume = 0.5;
    this.globalPitch = 1;
    this.quantization = 'none';
    this.loadDefaultSounds();
    this.effects = {
      reverb: this.audioContext.createConvolver(),
      delay: this.audioContext.createDelay(),
    };
    this.effects.delay.delayTime.value = 0.5; // Default delay time
    this.masterGain = this.audioContext.createGain();
    this.masterGain.connect(this.audioContext.destination);
  }

  async loadDefaultSounds() {
    for (let i = 0; i < 16; i++) {
      const soundIndex = this.getSoundIndexForPad(i);
      const buffer = await this.loadSoundBuffer(`assets/sounds/sound${soundIndex}.wav`);
      this.sounds[i] = { buffer, volume: this.globalVolume, pitch: this.globalPitch };
    }
  }

  getSoundIndexForPad(padIndex) {
    return this.getRandomInt(1, 209);
  }

  async loadSoundBuffer(urlOrData) {
    if (typeof urlOrData === 'string') {
      const response = await fetch(urlOrData);
      const arrayBuffer = await response.arrayBuffer();
      return await this.audioContext.decodeAudioData(arrayBuffer);
    } else {
      return await this.audioContext.decodeAudioData(urlOrData);
    }
  }

  playSound(padIndex) {
    const sound = this.sounds[padIndex];
    if (sound && sound.buffer) {
      const source = this.audioContext.createBufferSource();
      source.buffer = sound.buffer;
      source.playbackRate.value = sound.pitch;

      const gainNode = this.audioContext.createGain();
      gainNode.gain.value = sound.volume;

      // Apply effects
      source.connect(gainNode).connect(this.masterGain);

      source.start(0);
    }
  }

  randomizeSounds(numPads) {
    this.sounds = [];
    for (let i = 0; i < numPads; i++) {
      const soundIndex = this.getSoundIndexForPad(i);
      this.loadSoundBuffer(`assets/sounds/sound${soundIndex}.wav`).then((buffer) => {
        this.sounds[i] = { buffer, volume: this.globalVolume, pitch: this.globalPitch };
      });
    }
  }

  setGlobalVolume(volume) {
    this.globalVolume = volume;
    this.masterGain.gain.value = volume;
  }

  setGlobalPitch(pitch) {
    this.globalPitch = pitch;
    this.sounds.forEach((sound) => {
      if (sound) {
        sound.pitch = pitch;
      }
    });
  }

  setQuantization(value) {
    this.quantization = value;
  }

  getCurrentTime() {
    return this.audioContext.currentTime;
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
