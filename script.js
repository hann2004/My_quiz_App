// DOM Elements
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");
const backgroundVideo = document.getElementById("background-video");
const resultMessage = document.getElementById("result-message");

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

function showQuestion() {
    const questionElement = document.getElementById("question");
    const answerContainer = document.getElementById("answer");

    // Clear previous answers
    answerContainer.innerHTML = "";

    // Get the current question
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = `${currentQuestionIndex + 1}. ${currentQuestion.question}`; // Add question number

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
    scoreElement.textContent = `${score} / ${questions.length}`;

    // Display a message based on the score
    if (score === questions.length) {
        resultMessage.textContent = "Wonderful! You got a perfect score! 🎉";
    } else if (score >= 7) {
        resultMessage.textContent = "Good job! You scored well. 👍";
    } else if (score > 5) {
        resultMessage.textContent = "Not bad, but you can try again to improve. 😊";
    } else {
        resultMessage.textContent = "Keep trying, you'll get there! 💪";
    }
}

// Restart the Quiz
function restartQuiz() {
    resultScreen.classList.add("hidden"); // Hide the result screen
    startScreen.classList.remove("hidden"); // Show the start screen
    backgroundVideo.currentTime = 0; // Reset video
    backgroundVideo.play(); // Play video
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

// Event Listener for Restart Button
restartBtn.addEventListener("click", restartQuiz);

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
