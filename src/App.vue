<template>
  <article>
    <side-bar />
    <component :is="Page" />
  </article>
</template>

<script>
import DSPRecipes from '@/pages/DSPRecipes/DSPRecipes';
import NotFound from './pages/NotFound';
import RedBlackTreePage from './pages/RedBlackTreePage/RedBlackTreePage';
import HomePage from './pages/HomePage';
import SideBar from './components/SideBar';
import DijkstraPage from './pages/DijkstraPage/DijkstraPage';

const routes = {
  '/': HomePage,
  '/trees/red-black': RedBlackTreePage,
  '/pathfinding/dijkstra': DijkstraPage,
  '/dsp/recipes': DSPRecipes,
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
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
}

article {
  display: flex;
  width: 100vw;
  box-sizing: content-box;
}
</style>
