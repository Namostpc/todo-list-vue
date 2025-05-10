<script setup>
import { ref, computed, onMounted } from "vue";
import { useTodoStore } from "@/stores/todo";
import { RouterLink } from "vue-router";

import "../global.css";

const todoStore = useTodoStore();
const todoText = ref("");
const isLoading = ref(false);

const selectedStatus = ref('Pending')

const filterTodoList = computed(() => {
  return todoStore.list.filter(todo => todo.status === selectedStatus.value)
})

onMounted(async () => {
  isLoading.value = true;
  await todoStore.loadTodos();
  isLoading.value = false;
});

const addtodo = async (todoText) => {
  try {
    await todoStore.addTodo(todoText);
    isLoading.value = true;
    await todoStore.loadTodos();
    isLoading.value = false;
  } catch (error) {
    console.log("error", error);
  }
};

const editStatus = async (todoId, todoData) => {
  try {
    const updateData = {
      name: todoData.name,
      status: todoData.status,
    };
    isLoading.value = true;
    await todoStore.editTodo(updateData, todoId);
    isLoading.value = false;
  } catch (error) {
    console.log("error", error);
  }
};

const deleteTodo = async (todoId) => {
  try {
    isLoading.value = true;
    await todoStore.removeTodo(todoId);
    await todoStore.loadTodos();
    isLoading.value = false;
  } catch (error) {
    console.log("error", error);
  }
};

const changeStatus = async (event, todoId) => {
  try {
    if (event.target.checked) {
      await todoStore.editTodo({ status: "Done" }, todoId);
    } else {
      await todoStore.editTodo({ status: "Doing" }, todoId);
    }
    console.log(todoId);
  } catch (error) {
    console.log("error", error);
  }
  await todoStore.loadTodos();

};

const changeSelectedStatus = async (newStatus) => {
  selectedStatus.value = newStatus
}

const changeDoingStatus = async (todoId) => {
    try {
      await todoStore.editTodo({ status: "Doing" }, todoId);
    }catch (error) {
      console.log('error', error);
    }
    await todoStore.loadTodos();
}
</script>

<template>
  <div
    class="flex flex-col justify-center my-8 mx-8 outline-rose-500 h-screen w-full"
  >
    <div
      class="w-full items-center text-center my-10 text-8xl font-mono font-extrabold"
    >
      To do List
    </div>
    <div
      v-if="isLoading"
      class="flex justify-center items-center text-center fixed inset-0 bg-black bg-opacity-30"
    >
      <div role="status">
        <svg
          aria-hidden="true"
          class="inline w-50 h-50 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <div class="flex flex-row justify-center w-full">
      <div v-if="!isLoading" class="relative">
        <input
          type="text"
          v-model="todoText"
          id="text-add"
          class="block w-180 p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Add To do list"
        />
        <button
          @click="addtodo(todoText)"
          class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Add
        </button>
      </div>
    </div>
    <div>
      <div
        class="flex flex-wrap items-center justify-center mt-10  text-m font-medium text-center text-gray-500  border-b border-gray-200 dark:border-gray-700 dark:text-gray-400"
      >
        <div v-for="status in todoStore.statuses" class="w-36 ml-1 items-center p-4 text-blue-600 bg-gray-700 hover:bg-gray-700 rounded-t-lg cursor-pointer cursor-pointer"  
        :class="status === selectedStatus ? 'active dark:bg-purple-900 dark:text-white': ''"
        @click="changeSelectedStatus(status)" >
          <a>
            {{status}}
          </a>
        </div>
      </div>
    </div>
    <div
      class="flex flex-col justify-between w-full font-sans text-lg my-5 items-center text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    >
      <div
        v-for="todo in filterTodoList"
        class="flex basic-64 items-center w-180 justify-center"
      >
        <div class="flex items-center">
          <input
            type="checkbox"
            class="w-10 h-6 rounded-xl text-green-600"
            :checked="todo.status === 'Done'"
            @change="changeStatus($event, todo.id)"
          />
        </div>
        <div
          class="w-full text-xl text-center"
          :class="todo.status === 'Done' ? 'line-through' : 'no-underline'"
        >
          {{ todo.name }}
        </div>
        <div>
          <button @click="changeDoingStatus(todo.id)" class="mx-3 min-w-16 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="-250 -180 900 900">
              <path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 288c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128z"/></svg>
          </button>
        </div>
        <RouterLink :to="{ name: 'todo-edit', params: { id: todo.id } }">
          <button
            class="mx-3 min-w-16 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="-250 -180 900 900"
              class="items-center"
            >
              <path
                d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z"
              />
            </svg>
          </button>
        </RouterLink>
        <button
          @click="deleteTodo(todo.id)"
          class=" p-1 my-3 mx-3 min-w-16 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full items-center cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="-250 -190 900 900">
            <path
              d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
