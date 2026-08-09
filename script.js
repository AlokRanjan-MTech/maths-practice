var totalQuestions = 10;
var multiplySign = "\u00d7";
var currentQuestion = 0;
var score = 0;
var startTable = 2;
var endTable = 2;
var currentTable = 2;
var currentMultiplier = 2;
var answerSubmitted = false;

var setupSection = document.getElementById("setup");
var practiceSection = document.getElementById("practice");
var resultSection = document.getElementById("result");

var startTableSelect = document.getElementById("startTableSelect");
var endTableSelect = document.getElementById("endTableSelect");
var rangeText = document.getElementById("rangeText");
var startButton = document.getElementById("startButton");
var questionCount = document.getElementById("questionCount");
var questionText = document.getElementById("questionText");
var answerForm = document.getElementById("answerForm");
var answerInput = document.getElementById("answerInput");
var feedback = document.getElementById("feedback");
var scoreText = document.getElementById("scoreText");
var finalScore = document.getElementById("finalScore");
var againButton = document.getElementById("againButton");

startButton.addEventListener("click", startPractice);
startTableSelect.addEventListener("change", updateTableRange);
endTableSelect.addEventListener("change", updateTableRange);
answerForm.addEventListener("submit", submitAnswer);
againButton.addEventListener("click", showSetup);

updateTableRange();

function startPractice() {
  startTable = Number(startTableSelect.value);
  endTable = Number(endTableSelect.value);
  currentQuestion = 0;
  score = 0;

  setupSection.classList.add("hidden");
  resultSection.classList.add("hidden");
  practiceSection.classList.remove("hidden");

  showNextQuestion();
}

function showNextQuestion() {
  currentQuestion = currentQuestion + 1;
  currentTable = getRandomTable();
  currentMultiplier = getRandomMultiplier();
  answerSubmitted = false;

  questionCount.textContent = "Question " + currentQuestion + " of " + totalQuestions;
  questionText.textContent = currentTable + " " + multiplySign + " " + currentMultiplier + " = ?";
  scoreText.textContent = "Score: " + score;
  feedback.textContent = "";
  feedback.className = "feedback";
  answerInput.value = "";
  answerInput.focus();
}

function submitAnswer(event) {
  event.preventDefault();

  if (answerSubmitted) {
    return;
  }

  answerSubmitted = true;

  var studentAnswer = Number(answerInput.value);
  var correctAnswer = currentTable * currentMultiplier;

  if (studentAnswer === correctAnswer) {
    score = score + 1;
    feedback.textContent = "Correct!";
    feedback.className = "feedback correct";
  } else {
    feedback.textContent = "Wrong! Correct answer is " + correctAnswer;
    feedback.className = "feedback wrong";
  }

  scoreText.textContent = "Score: " + score;

  if (currentQuestion === totalQuestions) {
    setTimeout(showResult, 900);
  } else {
    setTimeout(showNextQuestion, 900);
  }
}

function showResult() {
  practiceSection.classList.add("hidden");
  resultSection.classList.remove("hidden");
  finalScore.textContent = "Score: " + score + " / " + totalQuestions;
}

function showSetup() {
  resultSection.classList.add("hidden");
  setupSection.classList.remove("hidden");
}

function getRandomMultiplier() {
  return Math.floor(Math.random() * 9) + 2;
}

function getRandomTable() {
  return Math.floor(Math.random() * (endTable - startTable + 1)) + startTable;
}

function updateTableRange() {
  var selectedStart = Number(startTableSelect.value);
  var selectedEnd = Number(endTableSelect.value);

  if (selectedEnd < selectedStart) {
    endTableSelect.value = selectedStart;
    selectedEnd = selectedStart;
  }

  updateEndTableOptions(selectedStart);

  if (selectedStart === selectedEnd) {
    rangeText.textContent = "Questions will be from Table " + selectedStart;
  } else {
    rangeText.textContent = "Questions will be from Tables " + selectedStart + " to " + selectedEnd;
  }
}

function updateEndTableOptions(selectedStart) {
  for (var i = 0; i < endTableSelect.options.length; i++) {
    var option = endTableSelect.options[i];
    option.disabled = Number(option.value) < selectedStart;
  }
}
