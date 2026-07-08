// Variables to control game state
let gameRunning = false; // Keeps track of whether game is active or not
let dropMaker; // Will store our timer that creates drops regularly
let countdownMaker; // Will store our timer that decrements the countdown
let timeLeft = parseInt(document.getElementById("time").textContent, 10) || 30;
let score = document.getElementById("score");
let timer = document.getElementById("time");
const winMessages = ["Great job!, You're a watchful water winner!", "Nice water work! Keep it up!", "Congrats! You're the ultimate water drop master!"];
const loseMessages = ["Not enough drops caught! Try again!", "You missed too many droplets, give it another go!", "Too many drops dropped, don't be downhearted! Try again!"];

// Wait for button click to start or reset the game
document.getElementById("start-btn").addEventListener("click", startGame);
document.getElementById("reset-btn").addEventListener("click", resetGame);

function resetGame() {
  clearInterval(dropMaker);
  clearInterval(countdownMaker);
  gameRunning = false;
  timeLeft = 30;
  score.textContent = "0";
  timer.textContent = "30";

  const gameContainer = document.getElementById("game-container");
  gameContainer.querySelectorAll(".water-drop, .bad-drop, .confetti-piece").forEach((drop) => drop.remove());
}

function startGame() {
  // Prevent multiple games from running at once
  if (gameRunning) return;

  gameRunning = true;
  timeLeft = 30;
  timer.textContent = timeLeft;

  const gameContainer = document.getElementById("game-container");
  gameContainer.querySelectorAll(".water-drop, .bad-drop, .confetti-piece").forEach((drop) => drop.remove());

  // Create new drops every second (1000 milliseconds)
  clearInterval(dropMaker);
  clearInterval(countdownMaker);
  dropMaker = setInterval(createDrop, 1000);

  countdownMaker = setInterval(() => {
    timeLeft -= 1;
    timer.textContent = timeLeft;

    if (timeLeft <= 0) {
      timer.textContent = "0";
      stopGame();
    }
  }, 1000);
}

function createDrop() {
  // Create a new div element that will be our water drop
  const drop = document.createElement("div");
  const isBadDrop = Math.random() < 0.10;
  drop.className = isBadDrop ? "bad-drop" : "water-drop";
  drop.addEventListener("click", function (event) {
    event.stopPropagation();

    if (isBadDrop) {
      score.textContent = Math.max(0, parseInt(score.textContent, 10) - 1);
    } else {
      score.textContent = parseInt(score.textContent, 10) + 1;
    }

    drop.remove();
  });

  // Make drops different sizes for visual variety
  const initialSize = 60;
  const sizeMultiplier = Math.random() * 0.8 + 0.5;
  const size = initialSize * sizeMultiplier;
  drop.style.width = drop.style.height = `${size}px`;

  // Position the drop randomly across the game width
  // Subtract 60 pixels to keep drops fully inside the container
  const gameWidth = document.getElementById("game-container").offsetWidth;
  const xPosition = Math.random() * (gameWidth - 60);
  drop.style.left = xPosition + "px";

  // Make drops fall for 4 seconds
  drop.style.animationDuration = "4s";

  // Add the new drop to the game screen
  document.getElementById("game-container").appendChild(drop);

  // Remove drops that reach the bottom (weren't clicked)
  drop.addEventListener("animationend", () => {
    drop.remove(); // Clean up drops that weren't caught
  });
}

function createConfetti() {
  const gameContainer = document.getElementById("game-container");
  gameContainer.querySelectorAll(".confetti-piece").forEach((piece) => piece.remove());

  const colors = ["#FFC907", "#FF902A", "#F16061", "#4FCB53", "#8BD1CB", "#ffffff"];

  for (let i = 0; i < 36; i += 1) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.width = `${8 + Math.random() * 8}px`;
    piece.style.height = `${10 + Math.random() * 10}px`;
    piece.style.setProperty("--x-offset", `${(Math.random() - 0.5) * 220}px`);
    piece.style.setProperty("--rotation", `${Math.random() * 720 - 360}deg`);
    piece.style.animationDelay = `${Math.random() * 0.1}s`;
    gameContainer.appendChild(piece);

    piece.addEventListener("animationend", () => {
      piece.remove();
    });
  }
}

function stopGame() {
  clearInterval(dropMaker);
  clearInterval(countdownMaker);
  gameRunning = false;

  const gameContainer = document.getElementById("game-container");
  gameContainer.querySelectorAll(".water-drop, .bad-drop").forEach((drop) => drop.remove());

  if (parseInt(score.textContent) >= 20) {
    createConfetti();
    alert(winMessages[Math.floor(Math.random() * winMessages.length)]);
  } else {
    alert(loseMessages[Math.floor(Math.random() * loseMessages.length)]);
  }
  score.textContent = "0";
  timer.textContent = "30";
}
