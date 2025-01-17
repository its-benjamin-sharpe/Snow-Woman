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

  notes.forEach((note) => {
    const key = document.createElement("div");
    key.textContent = note;
    key.className = note.includes("#") ? "black" : "white";
    piano.appendChild(key);
  });

  // MIDI Connection
  const midiStatus = document.getElementById("midi-status");
  JZZ().or("MIDI connection failed").openMidiIn().connect((msg) => {
    midiStatus.textContent = `Received MIDI: ${msg}`;
  });
});