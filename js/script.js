document.addEventListener("DOMContentLoaded", () => {
  // Snowfall Animation
  const snowContainer = document.querySelector(".snow-container");
  for (let i = 0; i < 100; i++) {
    const snowflake = document.createElement("div");
    snowflake.className = "snowflake";
    snowflake.style.left = `${Math.random() * 100}vw`;
    snowflake.style.animationDuration = `${Math.random() * 3 + 2}s`;
    snowflake.style.fontSize = `${Math.random() * 10 + 10}px`;
    snowflake.textContent = "❄";
    snowContainer.appendChild(snowflake);
  }

  // Playable Piano
  const piano = document.getElementById("piano");
  const notes = [
    "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
  ];

  // Create Piano Keys
  notes.forEach((note, index) => {
    const key = document.createElement("div");
    key.textContent = note;
    key.className = note.includes("#") ? "black" : "white";
    piano.appendChild(key);

    // Play Sound on Click
    key.addEventListener("click", () => {
      const audio = new Audio(`https://raw.githubusercontent.com/gleitz/midi-js-soundfonts/gh-pages/FluidR3_GM/piano-mp3/${note}.mp3`);
      audio.play();
    });
  });

  // MIDI Keyboard
  const midiStatus = document.getElementById("midi-status");
  const midiMessage = document.getElementById("midi-message");

  JZZ().or("MIDI connection failed").openMidiIn().connect((msg) => {
    midiStatus.textContent = "MIDI device connected!";
    midiMessage.textContent = `MIDI Message: ${msg}`;
  });
});