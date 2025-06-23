// Comments by Akshaj to help decipher code

// Adding the questions and answers using a nested structure

const modal = document.getElementById("score-modal");
const scoreMessage = document.getElementById("score-message");
const playAgainButton = document.getElementById("play-again");
const reviewContainer = document.getElementById("review-container");
let incorrectAnswers = [];

const questions = [
    {
        question: "How many time zones are there in Russia?",
        answers: [
            { text: "6", correct: false },
            { text: "11", correct: true },
            { text: "9", correct: false },
            { text: "13", correct: false }
        ]
    },
    {
        question: "What’s the national flower of Japan?",
        answers: [
            { text: "Iris", correct: false },
            { text: "Ume", correct: false },
            { text: "Sakura", correct: true },
            { text: "Higanbana", correct: false }
        ]
    },
    {
        question: "Which of the following empires had no written language?",
        answers: [
            { text: "Incan", correct: false },
            { text: "Aztec", correct: true },
            { text: "Egyptian", correct: false },
            { text: "Mauryan", correct: false }
        ]
    },
    {
        question: "What country has the most islands in the world?",
        answers: [
            { text: "Sweden", correct: true },
            { text: "India", correct: false },
            { text: "The Philippines", correct: false },
            { text: "The Maldives", correct: false }
        ]
    },
    {
        question: "Name the best-selling book series of the 21st century?",
        answers: [
            { text: "Percy Jackson", correct: false },
            { text: "The Hunger Games", correct: false },
            { text: "The Life of Pi", correct: false },
            { text: "Harry Potter", correct: true }
        ]
    }
];

// Initialising elements from the HTML file
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-btns");
const nextButton = document.getElementById("next-btn");
const startButton = document.getElementById("start-btn");
const welcomeScreen = document.getElementById("welcome-screen");
const quizScreen = document.getElementById("quiz-screen");
const countdownElement = document.createElement("div");

// Timer variables
const timerElement = document.createElement("div");
timerElement.className = "timer";
quizScreen.insertBefore(timerElement, questionElement);
let timer;
let timeLeft = 5;

let index = 0; // Setting question index and score to zero before quiz starts
let score = 0;

// Start button event listener – hides welcome screen, shows countdown, then quiz
startButton.addEventListener("click", () => {
    startButton.disabled = true;
    countdownElement.className = "countdown";
    welcomeScreen.appendChild(countdownElement);

    let countdown = 3;
    countdownElement.textContent = countdown;

    const countdownInterval = setInterval(() => {
        countdown--;
        countdownElement.textContent = countdown;

        if (countdown === 0) {
            clearInterval(countdownInterval);
            welcomeScreen.style.display = "none";
            quizScreen.style.display = "block";
            countdownElement.remove();
            startQuiz();
        }
    }, 1000);
});

const startQuiz = () => {
    index = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    quizScreen.classList.remove("fade-in");
    setTimeout(() => quizScreen.classList.add("fade-in"), 10);
    showQuestion();
};

// Displays the current question and starts the timer
const showQuestion = () => {
    resetState();
    clearInterval(timer); 
    timeLeft = 5;
    timerElement.textContent = `⏱️ Time left: ${timeLeft}s`;

    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `⏱️ Time left: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            timerElement.textContent = "⏰ Time's up!";
            disableAnswers(); // lock options and reveal correct one
        }
    }, 1000);

    let currentQuestion = questions[index];
    let questionNumber = index + 1;
    questionElement.innerHTML = `${questionNumber}. ${currentQuestion.question}`;

    currentQuestion.answers.forEach((answer, i) => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn", "slide-in");

        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }

        button.addEventListener("click", selectAnswer);
        answerButtons.appendChild(button);
    });

    if (index === questions.length - 1) {
        nextButton.innerHTML = "Finish";
    }
};

// Reset UI state for next question
const resetState = () => {
    nextButton.style.display = "none";
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
};

// Disables all options and shows the correct one (for timeouts)
const disableAnswers = () => {
    Array.from(answerButtons.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.style.backgroundColor = "#28a745";
        }
        button.disabled = true;
    });
    nextButton.style.display = "block";
};

// Handles user selecting an answer
const selectAnswer = (e) => {
    clearInterval(timer); // stop timer on answer
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    const currentQuestion = questions[index];

    if (!isCorrect) {
        // Save review entry
        const correctAnswer = currentQuestion.answers.find(ans => ans.correct).text;
        incorrectAnswers.push({
            question: currentQuestion.question,
            correctAnswer: correctAnswer
        });
    }

    if (isCorrect) {
        selectedBtn.style.backgroundColor = "#28a745";
        score++;
    } else {
        selectedBtn.style.backgroundColor = "#dc3545";
    }

    Array.from(answerButtons.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.style.backgroundColor = "#28a745";
        }
        button.disabled = true;
    });

    nextButton.style.display = "block";
};

// Score logic and replay
nextButton.addEventListener("click", () => {
    index++;
    if (index < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
});

// Show final score and Play Again logic
const showScore = () => {
    clearInterval(timer);
    resetState();
    timerElement.textContent = "";

    // Show modal
    modal.style.display = "flex";
    scoreMessage.textContent = `🎉 You scored ${score} out of ${questions.length}!`;
    if (incorrectAnswers.length > 0) {
        const heading = document.createElement("h3");
        heading.textContent = "Review Wrong Answers:";
        reviewContainer.appendChild(heading);

        incorrectAnswers.forEach(item => {
            const div = document.createElement("div");
            div.classList.add("review-item");
            div.innerHTML = `<strong>Q:</strong> ${item.question}<br><span class="correct"><strong>Correct:</strong> ${item.correctAnswer}</span>`;
            reviewContainer.appendChild(div);
        });
    } else {
        reviewContainer.innerHTML = `<p>✅ Perfect score! No wrong answers.</p>`;
    }
};
playAgainButton.addEventListener("click", () => {
    modal.style.display = "none";
    index = 0;
    score = 0;
    incorrectAnswers = [];
    startQuiz();
});
