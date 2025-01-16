// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, collection, doc, getDoc, setDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// Replace with your Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Jokes Data (Hardcoded)
const jokes = [
  { id: "joke1", setup: "Why did the snowman bring a map?", punchline: "Because he got lost in the snowdrift!" },
  { id: "joke2", setup: "What do you call a snowman in summer?", punchline: "A puddle!" },
  { id: "joke3", setup: "How does a snowman get around?", punchline: "By riding an icicle!" },
];

let currentJokeIndex = 0;

// DOM Elements
const setupElem = document.getElementById("joke-setup");
const punchlineElem = document.getElementById("joke-punchline");
const revealBtn = document.getElementById("reveal-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const likeBtn = document.getElementById("like-btn");
const likeCountElem = document.getElementById("like-count");
const commentForm = document.getElementById("comment-form");
const commentInput = document.getElementById("comment-input");
const commentList = document.getElementById("comment-list");

// Load Joke
function loadJoke(index) {
  const joke = jokes[index];
  setupElem.textContent = joke.setup;
  punchlineElem.textContent = joke.punchline;
  punchlineElem.classList.add("hidden");
  loadLikesAndComments(joke.id);
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

// Load Likes and Comments
async function loadLikesAndComments(jokeId) {
  const jokeRef = doc(db, "jokes", jokeId);
  const jokeDoc = await getDoc(jokeRef);

  if (jokeDoc.exists()) {
    const data = jokeDoc.data();
    likeCountElem.textContent = data.likes || 0;
    commentList.innerHTML = "";
    (data.comments || []).forEach((comment) => {
      const li = document.createElement("li");
      li.textContent = comment;
      commentList.appendChild(li);
    });
  } else {
    // Initialize joke data if it doesn't exist
    await setDoc(jokeRef, { likes: 0, comments: [] });
    likeCountElem.textContent = 0;
    commentList.innerHTML = "";
  }
}

// Like a Joke
likeBtn.addEventListener("click", async () => {
  const jokeId = jokes[currentJokeIndex].id;
  const jokeRef = doc(db, "jokes", jokeId);

  await updateDoc(jokeRef, {
    likes: (await getDoc(jokeRef)).data().likes + 1,
  });

  loadLikesAndComments(jokeId);
});

// Submit a Comment
commentForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const jokeId = jokes[currentJokeIndex].id;
  const jokeRef = doc(db, "jokes", jokeId);

  await updateDoc(jokeRef, {
    comments: arrayUnion(commentInput.value),
  });

  commentInput.value = "";
  loadLikesAndComments(jokeId);
});

// Initialize First Joke
loadJoke(currentJokeIndex);