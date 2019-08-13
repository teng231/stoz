<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
		<span>{{JSON.stringify(employees)}}</span>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import store from './store.js'
export default {
	name: 'app',
	data() {
		return {
			employees:[],
		}
	},
  components: {
    HelloWorld
	},
	async created() {
		let employees = await store.getEmployees({name: 'employees'})
		this.employees = employees
		debugger
	}
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
