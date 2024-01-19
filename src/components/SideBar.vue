<template>
  <aside>
    <a href="/trees/red-black">Red Black Tree</a>
    <a href="/pathfinding/dijkstra">Dijkstra Algorithm</a>
    <a href="/dsp/recipes">Dyson Sphere Program Recipes</a>
  </aside>
</template>

<script>
export default {
  name: 'SideBar'
}
</script>

<style scoped>
aside {
  width: max-content;
}

a {
  display: block;
  color: white;
  padding: 5px 20px;
}
</style>
