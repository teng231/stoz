<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
		<span>{{JSON.stringify(employees)}}</span>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import stoz from './store.js'
export default {
	name: 'app',
	data() {
		return {
			employees:[],
			sub:null
		}
	},
  components: {
    HelloWorld
	},
	async created() {
		this.sub = stoz.subscribe('user', (users)=> {
			this.employees = users.employees
		})
		let employees = await stoz.modules.getEmployees({name: 'employees'})
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
