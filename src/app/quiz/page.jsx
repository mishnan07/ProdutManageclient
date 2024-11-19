"use client";
import React, { useState, useEffect } from "react";
import toastr from "toastr";

const MathQuizGame = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null); // Store current question in state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(30); // 30 seconds for each question
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    // Fetching math-related questions on component mount
    const fetchMathQuestions = async () => {
      try {
        const response = await fetch("https://opentdb.com/api.php?amount=5&category=19&type=multiple");
        const data = await response.json();
        setQuestions(data.results); // Set fetched questions
        setCurrentQuestion(data.results[0]); // Set the first question as the current one
      } catch (error) {
        toastr.error("Error fetching questions");
      }
    };

    fetchMathQuestions();

    // Start timer for each question
    const timerInterval = setInterval(() => {
      if (timer > 0 && !answered) {
        setTimer((prevTimer) => prevTimer - 1);
      } else if (timer === 0 && !answered) {
        toastr.warning("Time's up! Moving to next question.");
        nextQuestion();
      }
    }, 1000);

    // Clear interval on cleanup
    return () => clearInterval(timerInterval);
  }, [timer, answered]);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      toastr.success("Correct Answer!");
    } else {
      toastr.error("Wrong Answer!");
    }
    setAnswered(true); // Mark question as answered
  };

  const nextQuestion = () => {
    setAnswered(false); // Reset answered flag
    setTimer(30); // Reset timer to 30 seconds
    const nextIndex = (currentQuestionIndex + 1) % questions.length;
    setCurrentQuestionIndex(nextIndex); // Update the index
    setCurrentQuestion(questions[nextIndex]); // Update the current question
  };

  // Make sure questions are available before rendering
  if (questions?.length === 0) {
    return <div>Loading questions...</div>;
  }

  return (
    <div className="h-[100vh] flex justify-center items-center px-5">
      <div className="bg-white border shadow sm:rounded-lg p-6 w-full max-w-xl">
        <h2 className="text-center text-2xl font-bold">Math Quiz Game</h2>
        <div className="mt-4">
          <h3 className="text-xl">Question {currentQuestionIndex + 1}</h3>
          <p className="text-lg">{currentQuestion.question}</p>
        </div>

        <div className="mt-6">
          {currentQuestion.incorrect_answers.concat(currentQuestion.correct_answer).map((answer, index) => (
            <button
              key={index}
              className="w-full py-2 mt-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
              onClick={() => handleAnswer(answer === currentQuestion.correct_answer)}
            >
              {answer}
            </button>
          ))}
        </div>

        <div className="mt-4 text-center">
          <p>Time remaining: {timer} seconds</p>
        </div>

        {answered && (
          <div className="mt-4 text-center">
            <button
              onClick={nextQuestion}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg"
            >
              Next Question
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MathQuizGame;
