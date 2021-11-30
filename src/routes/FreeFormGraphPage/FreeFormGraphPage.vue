<template>
  <div ref="graph" class="graph">

  </div>
</template>

<script>
import { getCurrentInstance, onMounted, onUnmounted } from 'vue';
import cytoscape from 'cytoscape';
import graphData from '../../graphs/graph.json';
import graphStyle from './graphStyle';


export default {
  name: 'FreeFormGraphPage',
  setup() {
    onMounted(() => {
      const instance = getCurrentInstance();
      instance.$graph = cytoscape({
        container: instance.refs.graph,
        boxSelectionEnabled: false,
        autounselectify: false,

        style: graphStyle,

        layout: { name: 'cose-bilkent' },

        elements: graphData,
      });
    })

    onUnmounted(() => {
      const instance = getCurrentInstance();
      instance.$graph.destroy();
    })
  }
}
</script>

<style scoped>
  .graph {
    position: relative;
    width: 100%;
    min-height: 800px;
    height: 100%;
  }
</style>