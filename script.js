var totalQuestions = 10;
var multiplySign = "\u00d7";
var currentQuestion = 0;
var score = 0;
var selectedTable = 2;
var currentMultiplier = 1;
var answerSubmitted = false;

var setupSection = document.getElementById("setup");
var practiceSection = document.getElementById("practice");
var resultSection = document.getElementById("result");

var tableSelect = document.getElementById("tableSelect");
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
answerForm.addEventListener("submit", submitAnswer);
againButton.addEventListener("click", showSetup);

function startPractice() {
  selectedTable = Number(tableSelect.value);
  currentQuestion = 0;
  score = 0;

  setupSection.classList.add("hidden");
  resultSection.classList.add("hidden");
  practiceSection.classList.remove("hidden");

  showNextQuestion();
}

function showNextQuestion() {
  currentQuestion = currentQuestion + 1;
  currentMultiplier = getRandomMultiplier();
  answerSubmitted = false;

  questionCount.textContent = "Question " + currentQuestion + " of " + totalQuestions;
  questionText.textContent = selectedTable + " " + multiplySign + " " + currentMultiplier + " = ?";
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
  var correctAnswer = selectedTable * currentMultiplier;

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
  return Math.floor(Math.random() * 10) + 1;
}
