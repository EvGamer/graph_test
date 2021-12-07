<template>
  <div ref="graph" class="graph">

  </div>
</template>

<script>
import { getCurrentInstance, onMounted, onUnmounted } from 'vue';
import cytoscape from 'cytoscape';
import graphStyle from './graphStyle';
import { shuffleRange } from '../../utils';
import { RedBlackTree } from '../../trees';

export default {
  name: 'RedBlackTree',
  setup() {
    onMounted(() => {
      const instance = getCurrentInstance();
      const graph = cytoscape({
        container: instance.refs.graph,
        boxSelectionEnabled: false,
        autounselectify: false,

        style: graphStyle,

        layout: { name: 'dagre' },

        elements: {
          edges: [],
          nodes: [],
        }
      })
      instance.$graph = graph;

      const keys = shuffleRange(0, 20);
      const tree = new RedBlackTree(graph, {});

      async function insertAll() {
        for (let key of keys) {
          await tree.animInsert(key, 'dummy')
        }
      }
      insertAll().then(() => console.log('done'));
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