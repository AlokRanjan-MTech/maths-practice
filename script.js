// Shared state
var MODULE_TABLE = "table";
var MODULE_INTEGER = "integer";
var MODE_NORMAL = "normal";
var MODE_WRONG = "wrong";

var multiplySign = "\u00d7";
var divideSign = "\u00f7";
var activeModule = MODULE_TABLE;
var practiceMode = MODE_NORMAL;
var totalQuestions = 10;
var currentQuestion = 0;
var score = 0;
var currentQuestionItem = null;
var lastQuestionKey = "";
var answerSubmitted = false;
var wrongAnswers = [];
var practiceQuestions = [];
var sessionStartTime = 0;
var totalTimeSeconds = 0;

var tableConfig = {
  startTable: 2,
  endTable: 2,
  totalQuestions: 10
};

var integerConfig = {
  operation: "addition",
  digitType: 2,
  totalQuestions: 10
};

// DOM references
var moduleSelectSection = document.getElementById("moduleSelect");
var tableSetupSection = document.getElementById("tableSetup");
var integerSetupSection = document.getElementById("integerSetup");
var practiceSection = document.getElementById("practice");
var resultSection = document.getElementById("result");

var tableModuleButton = document.getElementById("tableModuleButton");
var integerModuleButton = document.getElementById("integerModuleButton");
var backButtons = document.querySelectorAll("[data-back-to-modules]");
var startTableSelect = document.getElementById("startTableSelect");
var endTableSelect = document.getElementById("endTableSelect");
var rangeText = document.getElementById("rangeText");
var tableQuestionTotalOptions = document.getElementsByName("tableQuestionTotal");
var integerOperationOptions = document.getElementsByName("integerOperation");
var integerDigitTypeOptions = document.getElementsByName("integerDigitType");
var integerQuestionTotalOptions = document.getElementsByName("integerQuestionTotal");
var startTableButton = document.getElementById("startTableButton");
var startIntegerButton = document.getElementById("startIntegerButton");
var questionCount = document.getElementById("questionCount");
var questionText = document.getElementById("questionText");
var answerForm = document.getElementById("answerForm");
var answerInput = document.getElementById("answerInput");
var feedback = document.getElementById("feedback");
var scoreText = document.getElementById("scoreText");
var finalScore = document.getElementById("finalScore");
var resultCounts = document.getElementById("resultCounts");
var timeSummary = document.getElementById("timeSummary");
var performanceMessage = document.getElementById("performanceMessage");
var reviewSection = document.getElementById("reviewSection");
var reviewRows = document.getElementById("reviewRows");
var noReviewMessage = document.getElementById("noReviewMessage");
var wrongPracticeButton = document.getElementById("wrongPracticeButton");
var againButton = document.getElementById("againButton");
var resultBackButton = document.getElementById("resultBackButton");

// Event binding
tableModuleButton.addEventListener("click", showTableSetup);
integerModuleButton.addEventListener("click", showIntegerSetup);
startTableButton.addEventListener("click", startTablePractice);
startIntegerButton.addEventListener("click", startIntegerPractice);
startTableSelect.addEventListener("change", updateTableRange);
endTableSelect.addEventListener("change", updateTableRange);
answerForm.addEventListener("submit", submitAnswer);
wrongPracticeButton.addEventListener("click", startWrongAnswerPractice);
againButton.addEventListener("click", practiceAgain);
resultBackButton.addEventListener("click", returnToMathsPractice);

for (var i = 0; i < backButtons.length; i++) {
  backButtons[i].addEventListener("click", showModuleSelect);
}

updateTableRange();

// Screen navigation
function showOnly(sectionToShow) {
  moduleSelectSection.classList.add("hidden");
  tableSetupSection.classList.add("hidden");
  integerSetupSection.classList.add("hidden");
  practiceSection.classList.add("hidden");
  resultSection.classList.add("hidden");

  sectionToShow.classList.remove("hidden");
}

function showModuleSelect() {
  practiceQuestions = [];
  showOnly(moduleSelectSection);
}

function returnToMathsPractice() {
  practiceMode = MODE_NORMAL;
  currentQuestion = 0;
  score = 0;
  currentQuestionItem = null;
  lastQuestionKey = "";
  wrongAnswers = [];
  practiceQuestions = [];
  totalTimeSeconds = 0;
  showModuleSelect();
}

function showTableSetup() {
  activeModule = MODULE_TABLE;
  practiceQuestions = [];
  showOnly(tableSetupSection);
}

function showIntegerSetup() {
  activeModule = MODULE_INTEGER;
  practiceQuestions = [];
  showOnly(integerSetupSection);
}

// Shared practice engine
function startTablePractice() {
  activeModule = MODULE_TABLE;
  tableConfig = readTableConfig();
  startNormalPractice();
}

function startIntegerPractice() {
  activeModule = MODULE_INTEGER;
  integerConfig = readIntegerConfig();
  startNormalPractice();
}

function startNormalPractice() {
  practiceMode = MODE_NORMAL;
  totalQuestions = getActiveQuestionTotal();
  currentQuestion = 0;
  score = 0;
  lastQuestionKey = "";
  wrongAnswers = [];
  practiceQuestions = [];

  showOnly(practiceSection);
  showNextQuestion();
}

function showNextQuestion() {
  currentQuestion = currentQuestion + 1;

  if (currentQuestion === 1) {
    startTimer();
  }

  if (practiceMode === MODE_WRONG) {
    currentQuestionItem = practiceQuestions[currentQuestion - 1];
  } else {
    currentQuestionItem = createQuestion(lastQuestionKey);
  }

  lastQuestionKey = currentQuestionItem.key;
  answerSubmitted = false;

  questionCount.textContent = "Question " + currentQuestion + " of " + totalQuestions;
  showQuestion(currentQuestionItem);
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
  var correctAnswer = currentQuestionItem.answer;

  if (studentAnswer === correctAnswer) {
    score = score + 1;
    feedback.textContent = "Correct!";
    feedback.className = "feedback correct";
  } else {
    wrongAnswers.push({
      question: currentQuestionItem,
      studentAnswer: submittedAnswer
    });
    feedback.textContent = "Wrong! Correct answer is " + correctAnswer;
    feedback.className = "feedback wrong";
  }

  scoreText.textContent = "Score: " + score;

  if (currentQuestion === totalQuestions) {
    stopTimer();
    setTimeout(showResult, 900);
  } else {
    setTimeout(showNextQuestion, 900);
  }
}

function showResult() {
  var wrongCount = totalQuestions - score;
  var accuracy = Math.round((score / totalQuestions) * 100);

  showOnly(resultSection);
  finalScore.textContent = score + " / " + totalQuestions + " \u2022 " + accuracy + "%";
  resultCounts.textContent = score + " Correct \u2022 " + wrongCount + " Wrong";
  timeSummary.textContent = "Time: " + formatTime(totalTimeSeconds) + " \u2022 Avg: " + getAverageTime() + "s/question";
  performanceMessage.textContent = getPerformanceMessage(accuracy);
  showReview();
  updateWrongPracticeButton();
}

function practiceAgain() {
  startNormalPractice();
}

function createQuestion(previousKey) {
  if (activeModule === MODULE_INTEGER) {
    return createIntegerQuestion(integerConfig, previousKey);
  }

  return createTableQuestion(tableConfig, previousKey);
}

function showQuestion(question) {
  questionText.innerHTML = "";
  questionText.className = "question-text";

  if (question.module === MODULE_INTEGER) {
    questionText.classList.add("vertical-question");
    questionText.appendChild(createVerticalQuestionBlock(question));
    return;
  }

  questionText.textContent = formatQuestion(question);
}

function formatQuestion(question) {
  return question.left + " " + question.operator + " " + question.right + " = ?";
}

function createVerticalQuestionBlock(question) {
  var block = document.createElement("pre");
  var leftText = String(question.left);
  var rightText = String(question.right);
  var digitWidth = Math.max(leftText.length, rightText.length);
  var lineWidth = digitWidth + 2;
  var topLine = "  " + leftText.padStart(digitWidth, " ");
  var secondLine = question.operator + " " + rightText.padStart(digitWidth, " ");
  var answerLine = repeatCharacter("-", lineWidth);

  block.className = "vertical-question-block";
  block.textContent = topLine + "\n" + secondLine + "\n" + answerLine;

  return block;
}

function repeatCharacter(character, count) {
  var text = "";

  for (var i = 0; i < count; i++) {
    text = text + character;
  }

  return text;
}

function startWrongAnswerPractice() {
  practiceMode = MODE_WRONG;
  practiceQuestions = getUniqueWrongQuestions();
  shuffleQuestions(practiceQuestions);
  totalQuestions = practiceQuestions.length;
  currentQuestion = 0;
  score = 0;
  lastQuestionKey = "";
  wrongAnswers = [];

  showOnly(practiceSection);
  showNextQuestion();
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
    questionCell.textContent = formatReviewQuestion(wrongAnswer.question);
    answerCell.textContent = String(wrongAnswer.studentAnswer);

    reviewRows.appendChild(questionCell);
    reviewRows.appendChild(answerCell);
  }
}

function formatReviewQuestion(question) {
  return question.left + " " + question.operator + " " + question.right + " = " + question.answer;
}

function updateWrongPracticeButton() {
  if (wrongAnswers.length === 0) {
    wrongPracticeButton.classList.add("hidden");
  } else {
    wrongPracticeButton.classList.remove("hidden");
  }
}

function getUniqueWrongQuestions() {
  var uniqueQuestions = [];
  var seenQuestions = {};

  for (var i = 0; i < wrongAnswers.length; i++) {
    var question = wrongAnswers[i].question;

    if (!seenQuestions[question.key]) {
      seenQuestions[question.key] = true;
      uniqueQuestions.push(question);
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

// Table Practice
function readTableConfig() {
  return {
    startTable: Number(startTableSelect.value),
    endTable: Number(endTableSelect.value),
    totalQuestions: getSelectedNumber(tableQuestionTotalOptions, 10)
  };
}

function createTableQuestion(config, previousKey) {
  var question = null;
  var attempts = 0;

  do {
    var table = getRandomNumber(config.startTable, config.endTable);
    var multiplier = getRandomNumber(2, 10);

    question = buildQuestion(MODULE_TABLE, table, multiplySign, multiplier, table * multiplier);
    attempts = attempts + 1;
  } while (question.key === previousKey && attempts < 30);

  return question;
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

// Integer Practice
function readIntegerConfig() {
  return {
    operation: getSelectedValue(integerOperationOptions, "addition"),
    digitType: getSelectedNumber(integerDigitTypeOptions, 2),
    totalQuestions: getSelectedNumber(integerQuestionTotalOptions, 10)
  };
}

function createIntegerQuestion(config, previousKey) {
  var question = null;
  var attempts = 0;

  do {
    if (config.operation === "subtraction") {
      question = createSubtractionQuestion(config.digitType);
    } else if (config.operation === "multiplication") {
      question = createMultiplicationQuestion(config.digitType);
    } else if (config.operation === "division") {
      question = createDivisionQuestion(config.digitType);
    } else {
      question = createAdditionQuestion(config.digitType);
    }

    attempts = attempts + 1;
  } while (question.key === previousKey && attempts < 30);

  return question;
}

function createAdditionQuestion(digitType) {
  var range = getDigitRange(digitType);
  var left = getRandomNumber(range.min, range.max);
  var right = getRandomNumber(range.min, range.max);

  return buildQuestion(MODULE_INTEGER, left, "+", right, left + right);
}

function createSubtractionQuestion(digitType) {
  var range = getDigitRange(digitType);
  var left = getRandomNumber(range.min, range.max);
  var right = getRandomNumber(range.min, range.max);

  return buildQuestion(MODULE_INTEGER, left, "-", right, left - right);
}

function createMultiplicationQuestion(digitType) {
  var range = getDigitRange(digitType);
  var left = getRandomNumber(range.min, range.max);
  var right = getRandomNumber(2, 9);

  return buildQuestion(MODULE_INTEGER, left, multiplySign, right, left * right);
}

function createDivisionQuestion(digitType) {
  var range = getDigitRange(digitType);
  var divisor = getRandomNumber(2, 9);
  var minQuotient = Math.ceil(range.min / divisor);
  var maxQuotient = Math.floor(range.max / divisor);
  var quotient = getRandomNumber(minQuotient, maxQuotient);
  var dividend = quotient * divisor;

  return buildQuestion(MODULE_INTEGER, dividend, divideSign, divisor, quotient);
}

function getDigitRange(digitType) {
  if (digitType === 3) {
    return { min: 100, max: 999 };
  }

  if (digitType === 4) {
    return { min: 1000, max: 9999 };
  }

  if (digitType === 5) {
    return { min: 10000, max: 99999 };
  }

  return { min: 10, max: 99 };
}

// Shared helpers
function buildQuestion(moduleName, left, operator, right, answer) {
  return {
    module: moduleName,
    left: left,
    operator: operator,
    right: right,
    answer: answer,
    key: moduleName + "|" + left + "|" + operator + "|" + right
  };
}

function getActiveQuestionTotal() {
  if (activeModule === MODULE_INTEGER) {
    return integerConfig.totalQuestions;
  }

  return tableConfig.totalQuestions;
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getSelectedValue(options, fallback) {
  for (var i = 0; i < options.length; i++) {
    if (options[i].checked) {
      return options[i].value;
    }
  }

  return fallback;
}

function getSelectedNumber(options, fallback) {
  return Number(getSelectedValue(options, String(fallback)));
}

function startTimer() {
  sessionStartTime = Date.now();
  totalTimeSeconds = 0;
}

function stopTimer() {
  totalTimeSeconds = Math.round((Date.now() - sessionStartTime) / 1000);
}

function formatTime(seconds) {
  var minutes = Math.floor(seconds / 60);
  var remainingSeconds = seconds % 60;

  if (minutes === 0) {
    return remainingSeconds + "s";
  }

  return minutes + "m " + remainingSeconds + "s";
}

function getAverageTime() {
  return (totalTimeSeconds / totalQuestions).toFixed(1);
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
