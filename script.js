var totalQuestions = 10;
var multiplySign = "\u00d7";
var currentQuestion = 0;
var score = 0;
var startTable = 2;
var endTable = 2;
var currentTable = 2;
var currentMultiplier = 2;
var lastTable = 0;
var lastMultiplier = 0;
var answerSubmitted = false;
var wrongAnswers = [];
var practiceQuestions = [];

var setupSection = document.getElementById("setup");
var practiceSection = document.getElementById("practice");
var resultSection = document.getElementById("result");

var startTableSelect = document.getElementById("startTableSelect");
var endTableSelect = document.getElementById("endTableSelect");
var rangeText = document.getElementById("rangeText");
var questionTotalOptions = document.getElementsByName("questionTotal");
var startButton = document.getElementById("startButton");
var questionCount = document.getElementById("questionCount");
var questionText = document.getElementById("questionText");
var answerForm = document.getElementById("answerForm");
var answerInput = document.getElementById("answerInput");
var feedback = document.getElementById("feedback");
var scoreText = document.getElementById("scoreText");
var finalScore = document.getElementById("finalScore");
var resultCounts = document.getElementById("resultCounts");
var performanceMessage = document.getElementById("performanceMessage");
var reviewSection = document.getElementById("reviewSection");
var reviewRows = document.getElementById("reviewRows");
var noReviewMessage = document.getElementById("noReviewMessage");
var wrongPracticeButton = document.getElementById("wrongPracticeButton");
var againButton = document.getElementById("againButton");

startButton.addEventListener("click", startPractice);
startTableSelect.addEventListener("change", updateTableRange);
endTableSelect.addEventListener("change", updateTableRange);
answerForm.addEventListener("submit", submitAnswer);
wrongPracticeButton.addEventListener("click", startWrongAnswerPractice);
againButton.addEventListener("click", showSetup);

updateTableRange();

function startPractice() {
  startTable = Number(startTableSelect.value);
  endTable = Number(endTableSelect.value);
  totalQuestions = getSelectedQuestionTotal();
  currentQuestion = 0;
  score = 0;
  lastTable = 0;
  lastMultiplier = 0;
  wrongAnswers = [];
  practiceQuestions = [];

  setupSection.classList.add("hidden");
  resultSection.classList.add("hidden");
  practiceSection.classList.remove("hidden");

  showNextQuestion();
}

function showNextQuestion() {
  currentQuestion = currentQuestion + 1;
  if (practiceQuestions.length > 0) {
    setPracticeQuestion();
  } else {
    setRandomQuestion();
  }
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

  var submittedAnswer = answerInput.value;
  var studentAnswer = Number(submittedAnswer);
  var correctAnswer = currentTable * currentMultiplier;

  if (studentAnswer === correctAnswer) {
    score = score + 1;
    feedback.textContent = "Correct!";
    feedback.className = "feedback correct";
  } else {
    wrongAnswers.push({
      table: currentTable,
      multiplier: currentMultiplier,
      correctAnswer: correctAnswer,
      studentAnswer: submittedAnswer
    });
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
  var wrongCount = totalQuestions - score;
  var accuracy = Math.round((score / totalQuestions) * 100);

  practiceSection.classList.add("hidden");
  resultSection.classList.remove("hidden");
  finalScore.textContent = score + " / " + totalQuestions + " \u2022 " + accuracy + "%";
  resultCounts.textContent = score + " Correct \u2022 " + wrongCount + " Wrong";
  performanceMessage.textContent = getPerformanceMessage(accuracy);
  showReview();
  updateWrongPracticeButton();
}

function showSetup() {
  resultSection.classList.add("hidden");
  setupSection.classList.remove("hidden");
  practiceQuestions = [];
}

function getRandomMultiplier() {
  return Math.floor(Math.random() * 9) + 2;
}

function getRandomTable() {
  return Math.floor(Math.random() * (endTable - startTable + 1)) + startTable;
}

function setRandomQuestion() {
  do {
    currentTable = getRandomTable();
    currentMultiplier = getRandomMultiplier();
  } while (currentTable === lastTable && currentMultiplier === lastMultiplier);

  lastTable = currentTable;
  lastMultiplier = currentMultiplier;
}

function setPracticeQuestion() {
  var question = practiceQuestions[currentQuestion - 1];

  currentTable = question.table;
  currentMultiplier = question.multiplier;
  lastTable = currentTable;
  lastMultiplier = currentMultiplier;
}

function getSelectedQuestionTotal() {
  for (var i = 0; i < questionTotalOptions.length; i++) {
    if (questionTotalOptions[i].checked) {
      return Number(questionTotalOptions[i].value);
    }
  }

  return 10;
}

function getPerformanceMessage(accuracy) {
  if (accuracy >= 90) {
    return "Excellent!";
  }

  if (accuracy >= 75) {
    return "Great Job!";
  }

  if (accuracy >= 50) {
    return "Good Practice!";
  }

  return "Keep Practising!";
}

function showReview() {
  reviewRows.innerHTML = "";

  if (wrongAnswers.length === 0) {
    reviewSection.classList.add("hidden");
    noReviewMessage.classList.remove("hidden");
    return;
  }

  reviewSection.classList.remove("hidden");
  noReviewMessage.classList.add("hidden");

  for (var i = 0; i < wrongAnswers.length; i++) {
    var wrongAnswer = wrongAnswers[i];
    var questionCell = document.createElement("div");
    var answerCell = document.createElement("div");

    questionCell.className = "review-question";
    answerCell.className = "review-answer";
    questionCell.textContent = wrongAnswer.table + " " + multiplySign + " " + wrongAnswer.multiplier + " = " + wrongAnswer.correctAnswer;
    answerCell.textContent = String(wrongAnswer.studentAnswer);

    reviewRows.appendChild(questionCell);
    reviewRows.appendChild(answerCell);
  }
}

function updateWrongPracticeButton() {
  if (wrongAnswers.length === 0) {
    wrongPracticeButton.classList.add("hidden");
  } else {
    wrongPracticeButton.classList.remove("hidden");
  }
}

function startWrongAnswerPractice() {
  practiceQuestions = getUniqueWrongQuestions();
  shuffleQuestions(practiceQuestions);
  totalQuestions = practiceQuestions.length;
  currentQuestion = 0;
  score = 0;
  lastTable = 0;
  lastMultiplier = 0;
  wrongAnswers = [];

  resultSection.classList.add("hidden");
  setupSection.classList.add("hidden");
  practiceSection.classList.remove("hidden");

  showNextQuestion();
}

function getUniqueWrongQuestions() {
  var uniqueQuestions = [];
  var seenQuestions = {};

  for (var i = 0; i < wrongAnswers.length; i++) {
    var wrongAnswer = wrongAnswers[i];
    var key = wrongAnswer.table + "x" + wrongAnswer.multiplier;

    if (!seenQuestions[key]) {
      seenQuestions[key] = true;
      uniqueQuestions.push({
        table: wrongAnswer.table,
        multiplier: wrongAnswer.multiplier
      });
    }
  }

  return uniqueQuestions;
}

function shuffleQuestions(questions) {
  for (var i = questions.length - 1; i > 0; i--) {
    var randomIndex = Math.floor(Math.random() * (i + 1));
    var currentQuestionItem = questions[i];

    questions[i] = questions[randomIndex];
    questions[randomIndex] = currentQuestionItem;
  }
}

function updateTableRange() {
  var selectedStart = Number(startTableSelect.value);
  var selectedEnd = Number(endTableSelect.value);

  if (selectedEnd < selectedStart) {
    endTableSelect.value = String(selectedStart);
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
