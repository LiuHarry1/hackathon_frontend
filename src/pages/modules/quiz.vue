<template>
  <div>
    <h1>MCQ Quiz</h1>
    <div v-if="currentQuestionIndex < questions.length">
      <h2>Question {{ currentQuestionIndex + 1 }}</h2>
      <p>{{ questions[currentQuestionIndex].question }}</p>
      <ul>
        <li v-for="(option, index) in questions[currentQuestionIndex].options" :key="index">
          <label>
            <input type="radio" :value="index" v-model="selectedOptionIndex" />
            {{ option }}
          </label>
        </li>
      </ul>
      <button @click="nextQuestion">Next</button>
    </div>
    <div v-else>
      <h2>Quiz Results</h2>
      <p>Your score: {{ score }} out of {{ questions.length }}</p>
      <ul>
        <li v-for="(question, index) in questions" :key="index">
          {{ question.question }} - {{ questionResult(index) }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { BASE_URL } from '../../config';
export default {
  data() {
    return {
      currentQuestionIndex: 0,
      selectedOptionIndex: null,
      // questions: [
      //   {
      //     question: "Which gas do plants absorb from the atmosphere during photosynthesis?",
      //     options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
      //     correctAnswerIndex: 1
      //   },
      //   {
      //     question: "Who is the author of 'Romeo and Juliet'?",
      //     options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Leo Tolstoy"],
      //     correctAnswerIndex: 1
      //   },
      //   {
      //     question: "What is the chemical symbol for gold?",
      //     options: ["Ag", "Au", "Fe", "Cu"],
      //     correctAnswerIndex: 1
      //   },
      //   {
      //     question: "Which planet is known as the 'Red Planet'?",
      //     options: ["Earth", "Mars", "Venus", "Jupiter"],
      //     correctAnswerIndex: 1
      //   },
      //   {
      //     question: "What is the largest mammal on Earth?",
      //     options: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
      //     correctAnswerIndex: 1
      //   }
      // ],
      questions: [],
      userAnswers: [],
    };
  },
  computed: {
    score() {
      return this.userAnswers.filter((answer, index) => answer === this.questions[index].correctAnswerIndex).length;
    },
  },
  methods: {
    async fetchQuestions() {
      try {
        const response = await fetch(`${BASE_URL}/quiz/questions`); // Assuming the backend is running on the same host
        const data = await response.json();
        this.questions = data[0];
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    },
    nextQuestion() {
      if (this.selectedOptionIndex !== null) {
        this.userAnswers.push(this.selectedOptionIndex);
        this.selectedOptionIndex = null;
        this.currentQuestionIndex++;
      }
    },
    questionResult(index) {
      const userAnswer = this.userAnswers[index];
      const correctAnswer = this.questions[index].correctAnswerIndex;
      return userAnswer === correctAnswer ? "Correct" : "Incorrect";
    },
  },
  mounted() {
    this.fetchQuestions();
  },
};
</script>

<style scoped>
/* Add your CSS styles here */
/* Add global styles */
body {
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

/* Quiz section styles */
.quiz-section {
  margin-top: 20px;
}

h2 {
  margin-top: 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 10px 0;
}

label {
  display: block;
  cursor: pointer;
}

input[type="radio"] {
  margin-right: 10px;
}

button {
  background-color: #007BFF;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* Results section styles */
.results-section {
  display: none;
  margin-top: 20px;
}

.results-section.show {
  display: block;
}

/* Styling for correct and incorrect answers */
.correct {
  color: green;
  font-weight: bold;
}

.incorrect {
  color: red;
  font-weight: bold;
}

</style>
