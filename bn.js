const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startBtn = document.getElementById("start-btn");

const backgroundVideo = document.getElementById("background-video");

// Play the first 5 seconds on the start screen
backgroundVideo.addEventListener("loadedmetadata", () => {
    backgroundVideo.currentTime = 0; // Start at the beginning
    backgroundVideo.play();
});

// Event to handle the Start Quiz button
startBtn.addEventListener("click", () => {
    // Pause the video for a smooth transition
    backgroundVideo.pause();

    // Transition to the quiz screen
    startScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");

    // Continue playing the video from 5 seconds
    backgroundVideo.currentTime = 8;
    backgroundVideo.play();

    // Fade out the animated heading
    const quizHeading = document.getElementById("quiz-heading");
    quizHeading.classList.add("fade-out");
});

// Animated Heading Logic
document.addEventListener("DOMContentLoaded", () => {
    const quizHeading = document.getElementById("quiz-heading");
    const text = "Welcome To New Quiz";

    text.split("").forEach((char) => {
        const span = document.createElement("span");
        if (char === " ") {
            span.style.display = "inline-block"; // Keeps the space visible.
            span.style.width = "10px"; // Adjust the width for proper spacing.
        } else {
            span.textContent = char;
        }
        span.classList.add("letter");
        quizHeading.appendChild(span);
    });

    const letters = document.querySelectorAll(".letter");
    letters.forEach((letter, index) => {
        setTimeout(() => {
            letter.classList.add("visible");
        }, index * 500);
    });
});

function startQuiz() {
    console.log("Quiz Started!");
}


async function fetchQuestions() {
    const response = await fetch('https://opentdb.com/api.php?amount=10&type=multiple');
    const data = await response.json();
    return data.results; // Returns an array of questions
}

let questions = []; // To store fetched questions
let currentQuestionIndex = 0; // Track the current question

async function startQuiz() {
    console.log("Quiz Started!");
    questions = await fetchQuestions();
    console.log(questions); // Debug: See the fetched questions in the console
    showQuestion();
}

function showQuestion() {
    const questionContainer = document.getElementById("question-container");
    const questionElement = document.getElementById("question");
    const answerContainer = document.getElementById("answer");

    // Clear previous question/answers
    answerContainer.innerHTML = "";

    // Get the current question
    const currentQuestion = questions[currentQuestionIndex];

    // Set question text
    questionElement.textContent = currentQuestion.question;

    // Create answer buttons
    const allAnswers = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
    allAnswers.sort(() => Math.random() - 0.5); // Randomize answers

    allAnswers.forEach(answer => {
        const button = document.createElement("button");
        button.classList.add("answer-btn");
        button.innerHTML = `
            <input type="radio" name="answer" value="${answer}">
            <label>${answer}</label>
        `;
        button.addEventListener("click", () => selectAnswer(answer, currentQuestion.correct_answer));
        answerContainer.appendChild(button);
    });
    
}

function selectAnswer(button, correctAnswer) {
    const isCorrect = button.textContent === correctAnswer;
    button.style.backgroundColor = isCorrect ? "green" : "red";

    // Disable all buttons after selection
    const buttons = document.querySelectorAll(".answer-btn");
    buttons.forEach(btn => btn.disabled = true);

    // Show Next button
    const nextBtn = document.getElementById("next-btn");
    nextBtn.classList.remove("hidden");
}

const nextBtn = document.getElementById("next-btn");
nextBtn.addEventListener("click", () => {
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        showQuestion(); // Show the next question 
        nextBtn.classList.add("hidden"); 
    } else {
        showResult(); // End the quiz
    }
});

function showResult() {
    quizScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");

    const scoreElement = document.querySelector(".score");
    scoreElement.textContent = `${currentQuestionIndex} / ${questions.length}`;
}

startBtn.addEventListener("click", () => {
    backgroundVideo.pause();
    startScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");
    backgroundVideo.currentTime = 8;
    backgroundVideo.play();
    startQuiz(); // Start the quiz
});

let score = 0;

function selectAnswer(selectedAnswer, correctAnswer) {
    const isCorrect = selectedAnswer === correctAnswer;

    if (isCorrect) {
        score++; // Increment score if correct
    }

    // Disable all answer buttons
    const buttons = document.querySelectorAll(".answer-btn");
    buttons.forEach(btn => btn.disabled = true);

    // Highlight correct answer
    buttons.forEach(btn => {
        if (btn.textContent === correctAnswer) {
            btn.style.backgroundColor = "green";
        } else if (btn.textContent === selectedAnswer && !isCorrect) {
            btn.style.backgroundColor = "red";
        }
    });

    // Show Next button
    const nextBtn = document.getElementById("next-btn");
    nextBtn.classList.remove("hidden");
}

function showResult() {
    quizScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");

    const scoreElement = document.querySelector(".score");
    scoreElement.textContent = `${score} / ${questions.length}`;
}



// DOM Elements
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const backgroundVideo = document.getElementById("background-video");

// Variables
let questions = []; // Array to store fetched questions
let currentQuestionIndex = 0; // Track the current question
let score = 0; // Track the score

// Utility Function to Decode HTML Entities
function decodeHTML(html) {
    const text = document.createElement("textarea");
    text.innerHTML = html;
    return text.value;
}

// Fetch Questions from API
async function fetchQuestions() {
    const response = await fetch('https://opentdb.com/api.php?amount=10&type=multiple');
    const data = await response.json();
    return data.results.map(question => ({
        question: decodeHTML(question.question),
        correct_answer: decodeHTML(question.correct_answer),
        incorrect_answers: question.incorrect_answers.map(decodeHTML)
    }));
}

// Start the Quiz
async function startQuiz() {
    console.log("Quiz Started!");
    questions = await fetchQuestions(); // Fetch questions
    currentQuestionIndex = 0; // Reset question index
    score = 0; // Reset score
    showQuestion(); // Show the first question
}

// Show a Question
function showQuestion() {
    const questionElement = document.getElementById("question");
    const answerContainer = document.getElementById("answer");

    // Clear previous answers
    answerContainer.innerHTML = "";

    // Get the current question
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question; // Display the question

    // Combine and shuffle answers
    const allAnswers = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
    allAnswers.sort(() => Math.random() - 0.5); // Shuffle answers

    // Create buttons for each answer
    allAnswers.forEach(answer => {
        const button = document.createElement("button");
        button.textContent = answer; // Display the answer text
        button.classList.add("answer-btn");

        // Add click event listener
        button.addEventListener("click", () => {
            selectAnswer(answer, currentQuestion.correct_answer); // Handle answer selection
        });

        // Append the button to the answer container
        answerContainer.appendChild(button);
    });
}

// Handle Answer Selection
function selectAnswer(selectedAnswer, correctAnswer) {
    const isCorrect = selectedAnswer === correctAnswer;

    // Update score if correct
    if (isCorrect) {
        score++;
    }

    // Disable all answer buttons
    const buttons = document.querySelectorAll(".answer-btn");
    buttons.forEach(btn => btn.disabled = true);

    // Highlight correct and incorrect answers
    buttons.forEach(btn => {
        if (btn.textContent === correctAnswer) {
            btn.style.backgroundColor = "green"; // Highlight correct answer
        } else if (btn.textContent === selectedAnswer && !isCorrect) {
            btn.style.backgroundColor = "red"; // Highlight incorrect answer
        }
    });

    // Show the Next button
    nextBtn.classList.remove("hidden");
}

// Show the Result Screen
function showResult() {
    quizScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");

    const scoreElement = document.querySelector(".score");
    scoreElement.textContent = `Your Score: ${score} / ${questions.length}`;
}

// Event Listener for Next Button
nextBtn.addEventListener("click", () => {
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        showQuestion(); // Show the next question
        nextBtn.classList.add("hidden"); // Hide the Next button
    } else {
        showResult(); // End the quiz
    }
});

// Event Listener for Start Button
startBtn.addEventListener("click", () => {
    backgroundVideo.pause(); // Pause background video
    startScreen.classList.add("hidden"); // Hide start screen
    quizScreen.classList.remove("hidden"); // Show quiz screen
    backgroundVideo.currentTime = 8; // Continue video from 8 seconds
    backgroundVideo.play(); // Play video
    startQuiz(); // Start the quiz
});

// Animated Heading Logic
document.addEventListener("DOMContentLoaded", () => {
    const quizHeading = document.getElementById("quiz-heading");
    const text = "Welcome To New Quiz";

    text.split("").forEach((char) => {
        const span = document.createElement("span");
        span.textContent = char === " " ? "\u00A0" : char; // Add space or character
        span.classList.add("letter");
        quizHeading.appendChild(span);
    });

    const letters = document.querySelectorAll(".letter");
    letters.forEach((letter, index) => {
        setTimeout(() => {
            letter.classList.add("visible");
        }, index * 500);
    });
});
