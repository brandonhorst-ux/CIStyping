const sentences = [
  "the dog runs fast",
  "i see a red ball",
  "the cat is sleeping",
  "we like to play",
  "the sun is very bright",
  "the dog has a bone",
  "i can type words",
  "the bird can fly",
  "we go to the park",
  "the puppy is happy"
];

const sentenceEl = document.getElementById("sentence");
const input = document.getElementById("typingInput");
const starsEl = document.getElementById("stars");
const progressText = document.getElementById("progressText");
const streakText = document.getElementById("streakText");
const progressBar = document.getElementById("progressBar");
const character = document.getElementById("character");
const celebration = document.getElementById("celebration");
const celebrationMessage = document.getElementById("celebrationMessage");
const startScreen = document.getElementById("startScreen");
const finishedScreen = document.getElementById("finishedScreen");
const startButton = document.getElementById("startButton");
const playAgainButton = document.getElementById("playAgainButton");
const finalText = document.getElementById("finalText");
const finalStars = document.getElementById("finalStars");

let current = 0;
let stars = 0;
let streak = 0;
let accepting = false;

function startGame() {
  current = 0;
  stars = 0;
  streak = 0;
  accepting = true;
  starsEl.textContent = stars;
  finishedScreen.classList.remove("show");
  startScreen.classList.add("hidden");
  loadSentence();
}

function loadSentence() {
  accepting = true;
  sentenceEl.textContent = sentences[current];
  progressText.textContent = `Sentence ${current + 1} of ${sentences.length}`;
  streakText.textContent = streak > 1 ? `🔥 ${streak} in a row!` : "Ready!";
  progressBar.style.width = `${(current / sentences.length) * 100}%`;
  input.value = "";
  input.disabled = false;
  input.focus();
}

function celebrate() {
  accepting = false;
  input.disabled = true;
  stars++;
  streak++;
  starsEl.textContent = stars;
  streakText.textContent = `🔥 ${streak} in a row!`;
  progressBar.style.width = `${((current + 1) / sentences.length) * 100}%`;

  character.style.left = `${Math.min(88, 3 + ((current + 1) / sentences.length) * 82)}%`;

  celebrationMessage.textContent =
    streak >= 3 ? "🌟 Awesome! 🌟" : "🎉 Great job! 🎉";
  celebration.classList.add("show");
  sentenceEl.classList.add("correct-flash");

  setTimeout(() => {
    celebration.classList.remove("show");
    sentenceEl.classList.remove("correct-flash");

    if (current >= sentences.length - 1) {
      finishGame();
    } else {
      current++;
      loadSentence();
    }
  }, 1200);
}

function finishGame() {
  finalText.textContent = `You typed all ${sentences.length} sentences!`;
  finalStars.textContent = "⭐".repeat(stars);
  finishedScreen.classList.add("show");
}

input.addEventListener("input", () => {
  if (!accepting) return;

  // Keep the game lowercase-friendly and prevent accidental capitalization.
  let typed = input.value.toLowerCase();
  if (typed !== input.value) {
    input.value = typed;
  }

  const target = sentences[current];

  // Only accept characters that match the sentence at the current position.
  // This keeps the activity low-frustration: a wrong key simply does not stay.
  if (!target.startsWith(input.value)) {
    input.value = input.value.slice(0, -1);
    return;
  }

  if (input.value === target) {
    celebrate();
  }
});

startButton.addEventListener("click", startGame);
playAgainButton.addEventListener("click", startGame);
