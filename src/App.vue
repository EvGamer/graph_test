<template>
  <article>
    <side-bar></side-bar>
    <component :is="Page" />
  </article>
</template>

<script>
import NotFound from './routes/NotFound';
import RedBlackTreePage from './routes/RedBlackTreePage/RedBlackTreePage';
import HomePage from './routes/HomePage';
import SideBar from './components/SideBar';

const routes = {
  '/': HomePage,
  '/trees/red-black': RedBlackTreePage,
}

export default {
  name: 'App',
  components: { SideBar },
  data: () => ({
    currentRoute: window.location.pathname,
  }),
  computed: {
    Page () {
      return routes[this.currentRoute] || NotFound
    }
  }
}
</script>

<style>
body {
  background: #222222;
  color: white;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
}
</style>
