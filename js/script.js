// Firebase Initialization
const firebaseConfig = {
  apiKey: "AIzaSyBo@TziC2KCehJRKref9dnzNjOTOe_1za8",
  authDomain: "rockford-snow-woman.firebaseapp.com",
  projectId: "rockford-snow-woman",
  storageBucket: "rockford-snow-woman.appspot.com",
  messagingSenderId: "637010052164",
  appId: "1:637010052164:web:3463938aa214f774d22811"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Jokes
const jokes = [
  { id: "joke1", setup: "Why did the snowman bring a map?", punchline: "Because he got lost in the snowdrift!" },
  { id: "joke2", setup: "What do you call a snowman in summer?", punchline: "A puddle!" },
  { id: "joke3", setup: "How does a snowman get around?", punchline: "By riding an icicle!" },
];

let currentJokeIndex = 0;

// DOM Elements
const setupElem = document.getElementById("joke-setup");
const punchlineElem = document.getElementById("joke-punchline");
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
document.getElementById("reveal-btn").addEventListener("click", () => {
  punchlineElem.classList.toggle("hidden");
});

// Navigate Jokes
document.getElementById("prev-btn").addEventListener("click", () => {
  if (currentJokeIndex > 0) {
    currentJokeIndex--;
    loadJoke(currentJokeIndex);
  }
});

document.getElementById("next-btn").addEventListener("click", () => {
  if (currentJokeIndex < jokes.length - 1) {
    currentJokeIndex++;
    loadJoke(currentJokeIndex);
  }
});

// Load Likes and Comments from Firestore
async function loadLikesAndComments(jokeId) {
  const jokeRef = db.collection("jokes").doc(jokeId);
  const jokeDoc = await jokeRef.get();

  if (jokeDoc.exists) {
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
    await jokeRef.set({ likes: 0, comments: [] });
    likeCountElem.textContent = 0;
    commentList.innerHTML = "";
  }
}

// Like a Joke
likeBtn.addEventListener("click", async () => {
  const jokeId = jokes[currentJokeIndex].id;
  const jokeRef = db.collection("jokes").doc(jokeId);

  const jokeDoc = await jokeRef.get();
  if (jokeDoc.exists) {
    const newLikes = (jokeDoc.data().likes || 0) + 1;
    await jokeRef.update({ likes: newLikes });
    loadLikesAndComments(jokeId);
  }
});

// Submit a Comment
commentForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const jokeId = jokes[currentJokeIndex].id;
  const jokeRef = db.collection("jokes").doc(jokeId);

  await jokeRef.update({
    comments: firebase.firestore.FieldValue.arrayUnion(commentInput.value),
  });

  commentInput.value = "";
  loadLikesAndComments(jokeId);
});

// Initialize First Joke
loadJoke(currentJokeIndex);