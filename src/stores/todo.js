import { defineStore } from 'pinia'
import axios from 'axios'


const BASE_URL = 'https://681dc876c1c291fa6631a9ac.mockapi.io/api'
export const useTodoStore = defineStore('todo', {

  state: () => ({
    list: [],
    selectedTodo: {},
    statuses: ['Pending', 'Doing', 'Done']
  }),
  actions: {
    async loadTodos () {
      try {
        const response = await axios.get(`${BASE_URL}/todo`)
        this.list = response.data
        console.log('load todo completed');

      }catch (error) {
        console.log('error', error);
        
      }
    },
    async loadTodo (id){
      try {
        const response = await axios.get(`${BASE_URL}/todo/${id}`)
        this.selectedTodo = response.data
        console.log('load todo by id completed');
        
      }catch (error) {
        console.log('error', error);
      }
    },
    async addTodo (todoText){
      // todo name
      const bodyData = {
        name: todoText,
        status: 'Pending'
      }

      try{
        const response = await axios.post(`${BASE_URL}/todo`,bodyData)
        console.log(response.data);
        
        console.log('add todo complete')
        this.list.push(response.data)
      }catch (error){
        console.log('error', error)
      }
    },
    async editTodo (todoData,id){
      try{
        const response = await axios.put(`${BASE_URL}/todo/${id}`, todoData)
        console.log('Edit todo completed');
        
      }catch (error){
        console.log('error', error)
      }
    },
    async removeTodo (id) {
      try {
        const response = await axios.delete(`${BASE_URL}/todo/${id}`)
        console.log('delete todo completed');
        
      }catch (error){
        console.log('error', error);
        
      }
    }
  }
})
