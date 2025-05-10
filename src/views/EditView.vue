<script setup>
import { useTodoStore } from "@/stores/todo";
import { useRoute, RouterLink } from "vue-router";
import { ref, onMounted } from "vue";
import "../global.css";

const todoStore = useTodoStore();
const todoId = ref(-1);
const route = useRoute();
const isLoaded = ref(false);

onMounted(async () => {
  await todoStore.loadTodo(route.params.id);
  todoId.value = parseInt(route.params.id);
  isLoaded.value = true;
  console.log(todoStore.selectedTodo);
});

const editTodo = async (selectedTodo) => {
  try {
    const bodyData = {
      name: todoStore.selectedTodo.name,
      status: todoStore.selectedTodo.status,
    };
    await todoStore.editTodo(bodyData, todoId.value);
    alert("edit Competed");
  } catch (error) {
    console.log("error", error);
  }
};

const deleteTodo = async (todoId) => {
  try {
    isLoaded.value = true;
    await todoStore.removeTodo(todoId);
    await todoStore.loadTodos();
    isLoaded.value = false;
    alert("Delete todo list completed");
  } catch (error) {
    console.log("error", error);
  }
};
</script>

<template>
  <div>
    <RouterLink :to="{ name: 'home' }">
      <button
        class="mx-3 min-w-16 text-white font-bold py-2 px-4 rounded-full cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
          <path
            d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"
          />
        </svg>
      </button>
    </RouterLink>
    <div
      v-if="isLoaded"
      class="flex flex-col w-full items-center justify-center w-full mx-auto"
    >
      <div class="mb-6">
        <label
          for="text-box"
          class="block text-sm font-medium text-gray-900 dark:text-white w-100"
          >Todo Name</label
        >
        <input
          type="text"
          id="text-box"
          v-model="todoStore.selectedTodo.name"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
      <div class="w-100 my-1">
        <label
          for="select-status"
          class="block text-sm font-medium text-gray-900 dark:text-white"
          >Select an option</label
        >
        <select
          id="select-status"
          v-model="todoStore.selectedTodo.status"
          class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option>Select Status</option>
          <!-- ต้องทำการ blinding value เข้าไปด้วยเพื่อให้ option มีค่าส่งกลับไปหาฟอร์มได้-->
          <option v-for="status in todoStore.statuses" :value="status">
            {{ status }}
          </option>
        </select>
        <div>
          <button
            class="mx-auto my-5 min-w-20 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer"
            @click="editTodo(todoStore.selectedTodo.id)"
          >
            Edit
          </button>
          <button
            @click="deleteTodo(todoStore.selectedTodo.id)"
            class="p-1 my-3 mx-3 min-w-16 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full items-center cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
