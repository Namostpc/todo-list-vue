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
      name: selectedTodo.name,
      status: selectedTodo.status,
    };
    await todoStore.editTodo(bodyData, todoId.value);
    alert('edit Competed')
  } catch (error) {
    console.log("error", error);
  }
};
</script>

<template>
  <div>
    <RouterLink :to="{ name: 'home' }" class="flex text-xl underline">
        Back
    </RouterLink>
    <div v-if="isLoaded">
      id {{ todoId }}
      <div>
        <input type="text" v-model="todoStore.selectedTodo.name" />
      </div>
      <div>
        <select v-model="todoStore.selectedTodo.status">
          <option>Select Status</option>
          <!-- ต้องทำการ blinding value เข้าไปด้วยเพื่อให้ option มีค่าส่งกลับไปหาฟอร์มได้-->
          <option v-for="status in todoStore.statuses" :value="status">
            {{ status }}
          </option>
        </select>
        <div>
          <button @click="editTodo(todoStore.selectedTodo)">Edit</button>
        </div>
      </div>
    </div>
  </div>
</template>
