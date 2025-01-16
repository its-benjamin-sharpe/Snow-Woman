// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBo0TziC2KCehJRKref9dnzNjOTOe_1za8",
  authDomain: "rockford-snow-woman.firebaseapp.com",
  databaseURL: "https://rockford-snow-woman-default-rtdb.firebaseio.com",
  projectId: "rockford-snow-woman",
  storageBucket: "rockford-snow-woman.appspot.com",
  messagingSenderId: "637010052164",
  appId: "1:637010052164:web:3463930aa214f774d22811",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Jokes Logic
const jokes = [
  { setup: "Why was the snowman looking through the carrots?", punchline: "He was picking his nose!" },
  { setup: "What’s a snowman’s favorite snack?", punchline: "Ice Krispies!" },
  { setup: "How do snowmen greet each other?", punchline: "Ice to meet you!" },
  { setup: "Why did the snowman go to therapy?", punchline: "He had a meltdown!" },
  { setup: "What’s a snowman’s favorite drink?", punchline: "Ice tea!" }
];

let currentJokeIndex = 0;

document.getElementById("reveal-joke").addEventListener("click", () => {
  const joke = jokes[currentJokeIndex];
  document.getElementById("joke").textContent = joke.punchline;
  currentJokeIndex = (currentJokeIndex + 1) % jokes.length;
});

// Gallery Logic
const images = [
  "images/20250112_145512.jpg",
  "images/20250112_145520.jpg",
  "images/20250112_145526.jpg",
  "images/20250112_145533.jpg",
  "images/20250112_145541.jpg",
  "images/20250112_145559.jpg",
  "images/20250112_145604.jpg"
];

const gallery = document.getElementById("gallery");

images.forEach((image, index) => {
  const id = `image${index + 1}`;
  const container = document.createElement("div");
  container.className = "gallery-item";

  const img = document.createElement("img");
  img.src = image;
  img.alt = `Snowman ${index + 1}`;

  const details = document.createElement("div");
  details.className = "details";

  // Likes Section
  const likesContainer = document.createElement("div");
  likesContainer.className = "likes";
  const likesIcon = document.createElement("i");
  likesIcon.className = "fas fa-thumbs-up";
  likesIcon.style.cursor = "pointer";
  const likesCount = document.createElement("span");
  likesCount.textContent = "0 Likes";

  likesIcon.addEventListener("click", () => {
    const ref = database.ref(`images/${id}/likes`);
    ref.transaction((currentLikes) => (currentLikes || 0) + 1);
  });

  likesContainer.appendChild(likesIcon);
  likesContainer.appendChild(likesCount);

  // Sync Likes with Firebase
  database.ref(`images/${id}/likes`).on("value", (snapshot) => {
    likesCount.textContent = `${snapshot.val() || 0} Likes`;
  });

  // Comments Section
  const commentsContainer = document.createElement("div");
  commentsContainer.className = "comments";
  const commentInput = document.createElement("textarea");
  commentInput.placeholder = "Leave a comment...";
  const commentButton = document.createElement("button");
  commentButton.textContent = "Post Comment";

  commentButton.addEventListener("click", () => {
    const comment = commentInput.value.trim();
    if (comment) {
      database.ref(`images/${id}/comments`).push({
        text: comment,
        timestamp: Date.now()
      });
      commentInput.value = "";
    }
  });

  const commentsList = document.createElement("div");
  commentsList.className = "comments-list";

  // Sync Comments with Firebase
  database.ref(`images/${id}/comments`).on("child_added", (snapshot) => {
    const commentDiv = document.createElement("div");
    commentDiv.textContent = snapshot.val().text;
    commentsList.appendChild(commentDiv);
  });

  commentsContainer.appendChild(commentInput);
  commentsContainer.appendChild(commentButton);
  commentsContainer.appendChild(commentsList);

  details.appendChild(likesContainer);
  details.appendChild(commentsContainer);
  container.appendChild(img);
  container.appendChild(details);
  gallery.appendChild(container);
});

// Snowflakes Animation
const createSnowflake = () => {
  const snowflake = document.createElement("div");
  snowflake.className = "snowflake";
  snowflake.textContent = "❄";
  snowflake.style.left = Math.random() * window.innerWidth + "px";
  snowflake.style.animationDuration = Math.random() * 3 + 4 + "s";
  snowflake.style.fontSize = Math.random() * 10 + 20 + "px";
  document.body.appendChild(snowflake);
  setTimeout(() => snowflake.remove(), 7000);
};

setInterval(createSnowflake, 50);
