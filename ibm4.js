const pageTitleMain = document.getElementById("page-title-main");
const pageTitleGame = document.getElementById("page-title-game");

const startScreen = document.getElementById("start-screen");
const numberRangeForm = document.getElementById("number-range-form");
const startBtn = document.getElementById("start-btn");

const gameScreen = document.getElementById("game-screen");
const guessLabel = document.getElementById("guess-label");
const guessInput = document.getElementById("guess-input");
const checkBtn = document.getElementById("check-btn");
const hint = document.getElementById("hint");
const rangeText = document.getElementById("range-text");
const guessCount = document.getElementById("guesses");
const guessList = document.getElementById("guess-list");

const modal = document.getElementById("modal");
const modalMsg = document.getElementById("modal-message");
const modalBtn = document.getElementById("modal-btn");

let randomNumber = 0;
let numberRange = 0;
let guess = "";
let guessCounter = 0;

const isValidInput = (input) => {
  // If the input is valid, return true
  return input !== "" && !isNaN(input) && input > 0 && input <= numberRange;
};

const triggerFadeOut = (element) => {
  // Add the hidden class to the element after the animation is complete
  element.style.animation = "fadeOut 1s forwards";
  setTimeout(() => {
    element.classList.add("hidden");
  }, 500);
};

const triggerFadeIn = (element) => {
  // Remove the hidden class from the element after the animation is complete
  element.style.animation = "fadeIn 1s forwards";
  element.classList.remove("hidden");
};

const swapScreens = () => {
  // Swap the start screen with the game screen
  triggerFadeOut(startScreen);
  triggerFadeOut(pageTitleMain);

  // Wait for the animation to complete before fading in the game screen
  setTimeout(() => {
    triggerFadeIn(gameScreen);
    triggerFadeIn(pageTitleGame);
  }, 500);
};

const setGuessCountColour = (guessCounter) => {
  // Change the colour of the guess count based on the number of guesses remaining
  if (guessCounter > (getMaxGuesses(numberRange) / 3) * 2) {
    guessCount.style.color = "green";
  } else if (guessCounter > getMaxGuesses(numberRange) / 3) {
    guessCount.style.color = "orange";
  } else {
    guessCount.style.color = "red";
  }
};

const getMaxGuesses = (numberRange) => {
  // Return the maximum number of guesses based on the number range
  if (numberRange === 10) {
    return 3;
  } else if (numberRange === 100) {
    return 7;
  } else {
    return 10;
  }
};

const getListElement = (guess) => {
  // Return the list element with the guess and an icon
  let icon = "";
  if (guess > randomNumber) {
    icon = "🔻";
  } else if (guess < randomNumber) {
    icon = "🔺";
  } else {
    icon = "🎉";
  }
  return `<li>${guess}</li><div>${icon}</div>`;
};

const setupGame = () => {
  // Set up the game by getting the number range and generating a random number
  numberRange = parseInt(
    document.querySelector('input[name="number-input"]:checked').value
  );

  // Set the max attribute of the input to the number range
  guessInput.setAttribute("max", String(numberRange));

  swapScreens();

  randomNumber = Math.floor(Math.random() * numberRange + 1);

  // Set the guess label to include the number range
  guessLabel.textContent += ` ${numberRange}: `;
};

const playGame = () => {
  // Play the game by setting the guess counter and the guess count colour
  guessCounter = getMaxGuesses(numberRange);
  setGuessCountColour(guessCounter);
  guessCount.textContent = guessCounter;
  rangeText.textContent = guessCounter;
};

numberRangeForm.addEventListener("change", (e) => {
  e.preventDefault();
  // Enable the start button when a number range is selected
  startBtn.disabled = false;
});

startBtn.addEventListener("click", (e) => {
  e.preventDefault();
  // Start the game when the start button is clicked
  setupGame();
  playGame();
});

checkBtn.addEventListener("click", (e) => {
  e.preventDefault();

  if (!isValidInput(guessInput.value)) {
    // If the input is invalid, display a hint and return
    hint.textContent = `Please enter a number between 1 and ${numberRange}!`;
    hint.style.color = "red";
    return;
  }

  // If the input is valid, add the guess to the list and decrement the guess counter
  guess = parseInt(guessInput.value);
  guessList.innerHTML += getListElement(guess);
  guessCounter--;
  guessCount.textContent = guessCounter;

  if (guess === randomNumber) {
    // If the guess is correct, display a success message and return
    hint.textContent = "Correct. Well done!";
    hint.style.color = "green";
    modalMsg.textContent = "Congratulations!";
    modal.showModal();
    return;
  } else if (guessCounter === 0) {
    // If the guess counter is 0, display a failure message and return
    checkBtn.disabled = true;
    hint.textContent = "You are out of guesses!";
    hint.style.color = "red";
    modalMsg.innerHTML = `You lost! The number was <span class="title-decor">${randomNumber}</span>.`;
    modal.showModal();
    return;
  }

  // Set the guess count colour and display a hint based on the guess
  setGuessCountColour(guessCounter);

  if (guess > randomNumber) {
    hint.textContent = "Too high! Try again.";
    hint.style.color = "red";
  } else {
    hint.textContent = "Too low! Try again.";
    hint.style.color = "red";
  }

  // Clear the input after a guess is made
  guessInput.value = "";
});

modalBtn.addEventListener("click", () => {
  // Close the modal and reload the page when the modal button is clicked
  modal.close();
  triggerFadeOut(gameScreen);
  triggerFadeOut(pageTitleGame);

  location.reload();
});
