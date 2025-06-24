// Comments by Akshaj to help decipher code

// handles score popup and stores incorrect answers
const modal = document.getElementById("score-modal");
const scoreMessage = document.getElementById("score-message");
const playAgainButton = document.getElementById("play-again");
const reviewContainer = document.getElementById("review-container");
let incorrectAnswers = [];

// list of quiz questions and answer options
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

// get important parts of the HTML page
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-btns");
const nextButton = document.getElementById("next-btn");
const startButton = document.getElementById("start-btn");
const welcomeScreen = document.getElementById("welcome-screen");
const quizScreen = document.getElementById("quiz-screen");
const countdownElement = document.createElement("div");

// timer setup
const timerElement = document.createElement("div");
timerElement.className = "timer";
quizScreen.insertBefore(timerElement, questionElement);
let timer;
let timeLeft = 5;

// start with first question and score as 0
let index = 0;
let score = 0;

// when start is clicked, show countdown then quiz
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

// starts the quiz from the first question
const startQuiz = () => {
    index = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    quizScreen.classList.remove("fade-in");
    setTimeout(() => quizScreen.classList.add("fade-in"), 10);
    showQuestion();
};

// shows the current question and starts countdown timer
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
            disableAnswers(); // stop answering and show correct answer
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

// clears old buttons before next question
const resetState = () => {
    nextButton.style.display = "none";
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
};

// disables all answer buttons and shows the correct one (used when time is up)
const disableAnswers = () => {
    Array.from(answerButtons.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.style.backgroundColor = "#28a745";
        }
        button.disabled = true;
    });
    nextButton.style.display = "block";
};

// checks if answer is right or wrong and highlights it
const selectAnswer = (e) => {
    clearInterval(timer); // stop countdown when answer is clicked
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    const currentQuestion = questions[index];

    if (!isCorrect) {
        // save for review later
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

// goes to next question or ends quiz
nextButton.addEventListener("click", () => {
    index++;
    if (index < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
});

// shows final score and review of incorrect answers
const showScore = () => {
    clearInterval(timer);
    resetState();
    timerElement.textContent = "";

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

// restart the quiz when play again is clicked
playAgainButton.addEventListener("click", () => {
    modal.style.display = "none";
    index = 0;
    score = 0;
    incorrectAnswers = [];
    startQuiz();
});
