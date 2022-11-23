const RANDOM_QUOTE_API_URL = "https://api.quotable.io/random";
const quoteContainer = document.querySelector("#quote-display");
const quoteInput = document.querySelector("#quote-input");
const timer = document.querySelector("#timer");
const wpmContainer = document.querySelector("#wpm");
const wpmHighscoreContainer = document.querySelector("#wpm-highscore");
let wpmHighscore = 0;
let keyPresses = 0;
const accuracyContainer = document.querySelector("#accuracy");
let accuracy = 0;
let correctLetters;
let startTime;
let time;
let wpm;

quoteInput.addEventListener("keydown", (e) => {
  if (e.key === "Backspace") return;
  keyPresses++;
  correctLetters = document.querySelectorAll(".correct").length;

  accuracy = Math.round((correctLetters / keyPresses) * 100);
  accuracyContainer.innerText = accuracy;
});

quoteInput.addEventListener("input", () => {
  const arrayQuote = quoteContainer.querySelectorAll("span");
  const arrayValue = quoteInput.value.split("");

  let correct = true;

  arrayQuote.forEach((charSpan, index) => {
    const char = arrayValue[index];

    if (char == null) {
      charSpan.classList.remove("correct");
      charSpan.classList.remove("incorrect");
      correct = false;
    } else if (char === charSpan.innerText) {
      charSpan.classList.add("correct");
      charSpan.classList.remove("incorrect");
    } else {
      charSpan.classList.remove("correct");
      charSpan.classList.add("incorrect");
      correct = false;
    }
  });

  if (correct) renderNewQuote();
});

function getQuote() {
  return fetch(RANDOM_QUOTE_API_URL)
    .then((res) => res.json())
    .then((data) => data.content)
    .catch((err) => {
      console.error("Error: ", err);
    });
}

async function renderNewQuote() {
  const quote = await getQuote();
  quoteContainer.innerHTML = "";

  quote.split("").forEach((char) => {
    const charSpan = document.createElement("span");
    charSpan.innerText = char;
    quoteContainer.appendChild(charSpan);
  });

  quoteInput.value = null;

  wpmHighscore = wpm > wpmHighscore ? wpm : wpmHighscore;
  wpmHighscoreContainer.innerText = wpm > wpmHighscore ? wpm : wpmHighscore;

  startTimer();
}

function startTimer() {
  timer.innerText = 0;
  startTime = new Date();
  setInterval(() => {
    time = getTimerTime();
    timer.innerText = time;
    correctLetters = document.querySelectorAll(".correct").length;
    wpm = Math.round(correctLetters / 5 / (time / 60));
    wpmContainer.innerText = wpm;
  }, 1000);
}

function getTimerTime() {
  return Math.floor((new Date() - startTime) / 1000);
}

renderNewQuote();
