<template>
  <div>
    <!-- Module Info Section -->
    <div class="module-info">
      <h1>{{ moduleData.mname }}</h1>
      <p>Progress: {{ moduleData.progress }}</p>
      <p>{{ moduleData.description }}</p>
    </div>

    <!-- Lessons Table Section -->
    <div class="lessons-table">
      <table>
        <thead>
        <tr>
          <th>Lesson Name</th>
          <th>Information</th>
          <th>Edit</th>
          <th>Delete</th>
          <th>Quiz</th>
          <th>Assignment</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="lesson in moduleData.lessons" :key="lesson.id">
          <td>{{ lesson.lname }}</td>
          <td>{{ lesson.information }}</td>
          <td><button @click="editLesson(lesson.id)">Edit</button></td>
          <td><button @click="deleteLesson(lesson.id)">Delete</button></td>
          <td><button @click="startQuiz(lesson.id)">Quiz</button></td>
          <td><button @click="startAssignment(lesson.id)">Assignment</button></td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      moduleData: {
        mname: 'Quiz Assignment',
        progress: 50,
        description: 'This is a sample module description',
        lessons: [
          { id: 1, lname: 'Lesson 1', information: 'information 1' },
          { id: 2, lname: 'Lesson 2', information: 'information 2' },
          { id: 3, lname: 'Lesson 3', information: 'information 3' },
          { id: 4, lname: 'Lesson 4', information: 'information 4' },
          { id: 5, lname: 'Lesson 5', information: 'information 5' },
        ]},
      moduleId: 1, // Replace with the actual module ID you want to fetch
    };
  },
  mounted() {
    this.fetchModuleInformation();
  },
  methods: {
    fetchModuleInformation() {
      // Replace 'http://localhost:5000' with your actual backend API URL
      axios.get(`http://localhost:8081/api/modules/${this.moduleId}`)
        .then((response) => {
          this.moduleData = response.data;
        })
        .catch((error) => {
          console.error('Error fetching module information:', error);
        });
    },
    editLesson(lessonId) {
      // Implement the edit functionality
    },
    deleteLesson(lessonId) {
      console.log('Delete lesson with ID:', lessonId);
      // Find the lesson index in the lessons array
      const lessonIndex = this.moduleData.lessons.findIndex((lesson) => lesson.id === lessonId);

      if (lessonIndex !== -1) {
        // Simulate deletion by removing the lesson from the array
        this.moduleData.lessons.splice(lessonIndex, 1);
      }
    },
    startQuiz(lessonId) {
      // Implement the quiz functionality
    },
    startAssignment(lessonId) {
      // Implement the assignment functionality
      this.$router.push('/race/assignment');
    },
  },
};
</script>

<style scoped>
/* Module Info Section */
.module-info {
  background-color: #f0f0f0;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 5px;
}

.module-info h1 {
  font-size: 24px;
  margin-bottom: 10px;
}

/* Lessons Table Section */
.lessons-table table {
  width: 100%;
  border-collapse: collapse;
}

.lessons-table th,
.lessons-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

.lessons-table th {
  background-color: #f0f0f0;
  font-weight: bold;
}

.lessons-table tr:hover {
  background-color: #f5f5f5;
}

/* Button Styles */
button {
  padding: 8px 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 14px;
  margin-right: 5px;
}

button:hover {
  background-color: #0056b3;
}

/* Loading Message */
.loading-message {
  font-style: italic;
  color: #888;
}

</style>
