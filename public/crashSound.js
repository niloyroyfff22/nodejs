// SoundManager class (Already professional version)
class SoundManager {
  constructor() {
    this.sounds = {};
    this.enabled = true; // 🔊 default: sounds on
  }

  load(id) {
    const el = document.getElementById(id);
    if (!el) return;
    this.sounds[id] = el;
  }

  play(id, volume = 1.0) {
    if (!this.enabled) return; // ✅ check sound ON/OFF
    const sound = this.sounds[id];
    if (!sound) return;
    const clone = sound.cloneNode(true); // multiple play
    clone.volume = volume;
    clone.play().catch(e => console.log("Sound play error:", e));
  }

  toggle() {
    this.enabled = !this.enabled;
    console.log("Sound:", this.enabled ? "ON" : "OFF");
  }

  setEnabled(state) {
    this.enabled = state;
  }
}

const AudioSys = new SoundManager();

// Preload all sounds
['plane-background', 'tick', 'crash', 'win', 'plane-crash'].forEach(id => AudioSys.load(id));

const soundBtn = document.getElementById("soundToggle");

soundBtn.addEventListener("click", () => {
    AudioSys.toggle();

    // Update button icon
    soundBtn.textContent = AudioSys.enabled ? "🔊" : "🔇";
});


