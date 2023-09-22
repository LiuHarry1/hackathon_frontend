<template>
  <div>
    <h1>Quiz Assignment</h1>

    <div class="top_layer">
      <div class="left">
        <h2>{{ moduleName }}</h2>
        <p>{{ lessonName }}</p>
        <p>Time Limit: {{ timeLimit }}</p>
      </div>
      <div class="right">
        <router-link to="/questions">
          <button>Have Questions</button>
        </router-link>

        <!-- Text input for quiz question and Generate Quiz button -->
        <input type="text" v-model="quizQuestion" placeholder="Enter a quiz question" />
        <button @click="generateQuiz">Generate Quiz</button>

        <!-- Display the generated quiz -->
        <div v-if="generatedQuiz">
          <h3>Generated Quiz</h3>
          <p>{{ generatedQuiz }}</p>
        </div>
      </div>
    </div>

    <!-- File Upload Section -->
    <div class="button_layer">
      <div class = "button_layer1">
        <div>
          <h2>Upload Quiz Assignment Text File</h2>
          <input type="file" @change="handleFileUpload" />
          <button @click="uploadFile">Upload File</button>
          <p>{{ uploadMessage }}</p>
        </div>

        <!-- File Download Section -->
        <div>
          <h2>Download Quiz Assignment Text File</h2>
          <button @click="downloadFile">Download File</button>
        </div>
      </div>
      <div class="button_layer1">
        <div>
          <button @click="fetchGrades">Grades</button>
        </div>
        <div v-if="showGrades">
          <!-- Display grades here -->
          <p v-if="grades">Grades: {{ grades }}</p>
        </div>
      </div>
      <div class="button_layer1">
        <div>
          <button @click="fetchComments">Comments</button>
        </div>
        <div v-if="showComments">
          <!-- Display comments here -->
          <p v-if="comments">Comments: {{ comments }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'; // Import Axios
import { BASE_URL } from '../../config';

export default {
  data() {
    return {
      selectedFile: null,
      uploadMessage: '',
      moduleName: 'Digital Literacy',
      lessonName: 'Lesson 1',
      timeLimit: '60 minutes',
      showGrades: false,
      showComments: false,
      grades: null,
      comments: null,
      quizQuestion: '', // Added quizQuestion data property
      generatedQuiz: '', // Added property to store the generated quiz
    };
  },
  methods: {
    fetchGrades() {
      // Send a request to the backend to fetch grades
      // Handle the server response and populate the data in the component
      // Use Axios or similar library to make the API call
      axios
        .get(`${BASE_URL}/grades`)
        // .get('https://vmg65etpjy.us-east-1.awsapprunner.com/grades')
        .then((response) => {
          this.grades = response.data.grades;
          this.showGrades = true;
        })
        .catch((error) => {
          console.error('Error fetching grades:', error);
        });
    },
    fetchComments() {
      // Send a request to the backend to fetch comments
      // Handle the server response and populate the data in the component
      // Use Axios or similar library to make the API call

      axios
        .get(`${BASE_URL}/comments`)
        // .get('https://vmg65etpjy.us-east-1.awsapprunner.com/comments')
        .then((response) => {
          this.comments = response.data.comments;
          this.showComments = true;
        })
        .catch((error) => {
          console.error('Error fetching comments:', error);
        });
    },
    handleFileUpload(event) {
      // Handle the selected file (e.g., store it in data property)
      this.selectedFile = event.target.files[0];
    },
    uploadFile() {
      if (!this.selectedFile) {
        this.uploadMessage = 'Please select a file to upload.';
        return;
      }

      // Create a FormData object to send the file to the server
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      // Send a POST request to the server's upload endpoint
      axios
        .post(`${BASE_URL}/upload`, formData)
        // .post('https://vmg65etpjy.us-east-1.awsapprunner.com/upload', formData)
        .then((response) => {
          // Handle the server response (e.g., display a success message)
          this.uploadMessage = response.data.message;
        })
        .catch((error) => {
          // Handle errors (e.g., display an error message)
          this.uploadMessage = 'An error occurred during file upload.';
          console.error(error);
        });
    },
    generateQuiz() {
      // Send a POST request to the Flask backend to generate the quiz
      axios
        .post(`${BASE_URL}/generate_quiz`, { quizQuestion: this.quizQuestion })
        .then((response) => {
          // Handle the response and set the generatedQuiz property
          this.generatedQuiz = response.data.quiz;
        })
        .catch((error) => {
          // Handle errors
          console.error('Error generating quiz:', error);
        });
    },
    downloadFile() {
      // Replace 'your-backend-url' with the actual URL of your Flask backend
      const downloadUrl = `${BASE_URL}/download/quiz_assignment.txt`;
      // const downloadUrl = 'https://vmg65etpjy.us-east-1.awsapprunner.com/download/quiz_assignment.txt';

      // Use Axios to request and trigger the file download
      axios
        .get(downloadUrl, { responseType: 'blob' })
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'quiz_assignment.txt');
          document.body.appendChild(link);
          link.click();
        })
        .catch((error) => {
          console.error('Error downloading file:', error);
        });
    },
  },
};
</script>

<style>
/* Style for the outer container */
.container {
  font-family: Arial, sans-serif;
  margin: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
}

/* Style for the Quiz Assignment title */
h1 {
  font-size: 24px;
  color: #333;
}

/* Style for the top layer */
.top_layer {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
}

/* Style for the left side of the top layer */
.left {
  flex: 1;
}

/* Style for module name */
h2 {
  font-size: 18px;
  color: #333;
}

/* Style for lesson name and time limit */
p {
  font-size: 14px;
  color: #666;
}

/* Style for the right side of the top layer */
.right button {
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
}

/* Style for the File Upload and Download section */
.button_layer {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
  flex-direction: column;
}

/* Style for each button layer (Upload/Download, Grades, Comments) */
.button_layer1,
.button_layer2 {
  flex: 1;
  margin-right: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #fff;
}

/* Style for the Upload button */
input[type="file"] {
  /*display: none;*/
}

.button_layer1 button {
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
}

/* Style for the Download button */
.button_layer1 button:hover {
  background-color: #0056b3;
}

/* Style for the Grades and Comments buttons */
.button_layer2 button {
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
}

/* Style for the Grades and Comments buttons on hover */
.button_layer2 button:hover {
  background-color: #1d8c39;
}

/* Style for the messages (e.g., upload message) */
p {
  margin-top: 10px;
  font-size: 14px;
  color: #333;
}

/* Add any additional styling as needed */
</style>

