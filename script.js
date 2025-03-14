const weekList = document.getElementById("weekList");
const questionsDiv = document.getElementById("questions");
const weekTitle = document.getElementById("weekTitle");

// Create week list
for (let i = 1; i <= 13; i++) {
  const li = document.createElement("li");
  li.textContent = `Week ${i}`;
  li.onclick = () => loadWeekData(i);
  weekList.appendChild(li);
}

// Load Week Data
function loadWeekData(week) {
  weekTitle.textContent = `Week ${week}`;
  questionsDiv.innerHTML = "<p>Loading questions...</p>";

  const script = document.createElement("script");
  script.src = `weeks/week${week}.js`;
  script.onload = () => {
    questionsDiv.innerHTML = ""; // Clear loading text
    loadQuestions(eval(`week${week}Data`)); // Dynamically load the week's data
  };
  document.body.appendChild(script);
}

// Load Questions into UI
function loadQuestions(data) {
  if (data.length === 0) {
    questionsDiv.innerHTML = "<p>No questions available for this week.</p>";
    return;
  }

  data.forEach((item, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.className = "question";

    let optionsHtml = item.options
      .map(
        (option) => `
          <li>
              <label>
                  <input type="radio" name="q${index}" value="${option}"> ${option}
              </label>
          </li>`
      )
      .join("");

    questionDiv.innerHTML = `
      <strong>Q${index + 1}:</strong> ${item.question}
      <ul>${optionsHtml}</ul>
      <button onclick="showAnswer(${index}, '${item.answer}')">Show Answer</button>
      <p class="answer" id="answer${index}"></p>`;

    questionsDiv.appendChild(questionDiv);
  });

  // Add Submit Button
  const submitButton = document.createElement("button");
  submitButton.textContent = "Submit Answers";
  submitButton.onclick = () => checkAnswers(data);
  questionsDiv.appendChild(submitButton);
}

// Show Correct Answer
function showAnswer(index, correctAnswer) {
  const answerDisplay = document.getElementById(`answer${index}`);
  answerDisplay.textContent = `Correct Answer: ${correctAnswer}`;
  answerDisplay.style.display = "block";
}

// Check Answers
function checkAnswers(data) {
  data.forEach((item, index) => {
    const selectedOption = document.querySelector(`input[name="q${index}"]:checked`);
    const answerDisplay = document.getElementById(`answer${index}`);

    if (selectedOption) {
      if (selectedOption.value === item.answer) {
        answerDisplay.textContent = "Correct ✅";
        answerDisplay.className = "answer correct";
      } else {
        answerDisplay.textContent = `Incorrect ❌ (Correct: ${item.answer})`;
        answerDisplay.className = "answer incorrect";
      }
    } else {
      answerDisplay.textContent = "No answer selected ❌";
      answerDisplay.className = "answer incorrect";
    }

    answerDisplay.style.display = "block";
  });

  document.querySelectorAll("input[type=radio]").forEach((input) => {
    input.disabled = true;
  });
}
