// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM Elements
const setupElem = document.getElementById("joke-setup");
const punchlineElem = document.getElementById("joke-punchline");
const revealBtn = document.getElementById("reveal-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const form = document.getElementById("joke-form");

let jokes = [];
let currentJokeIndex = 0;

// Load jokes from Firebase
async function loadJokes() {
  const querySnapshot = await getDocs(collection(db, "jokes"));
  jokes = querySnapshot.docs.map(doc => doc.data());
  if (jokes.length > 0) {
    loadJoke(currentJokeIndex);
  }
}

// Display a joke
function loadJoke(index) {
  setupElem.textContent = jokes[index].setup;
  punchlineElem.textContent = jokes[index].punchline;
  punchlineElem.classList.add("hidden");
}

// Reveal Punchline
revealBtn.addEventListener("click", () => {
  punchlineElem.classList.toggle("hidden");
});

// Navigate Jokes
prevBtn.addEventListener("click", () => {
  if (currentJokeIndex > 0) {
    currentJokeIndex--;
    loadJoke(currentJokeIndex);
  }
});

nextBtn.addEventListener("click", () => {
  if (currentJokeIndex < jokes.length - 1) {
    currentJokeIndex++;
    loadJoke(currentJokeIndex);
  }
});

// Add New Joke
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const setup = document.getElementById("joke-setup-input").value;
  const punchline = document.getElementById("joke-punchline-input").value;

  await addDoc(collection(db, "jokes"), { setup, punchline });
  alert("Joke added!");
  form.reset();
  loadJokes();
});

// Initialize
loadJokes();