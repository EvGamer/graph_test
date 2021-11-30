<template>
  <div class="page">
    <div ref="graph" class="graph" />
    <div>
      <Table
        key-field="nodeId"
        :columns="priorityQueueColumns"
        :values="priorityQueue"
      />
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, onUnmounted } from 'vue';
import cytoscape from 'cytoscape';
import Table from '../../components/Table';
import graphData from '../../graphs/graph.json';
import graphStyle from './graphStyle';


export default {
  name: 'FreeFormGraphPage',

  components: {
    Table,
  },

  data: () => ({
    priorityQueue: [],
    priorityQueueColumns: [
      { name: 'Node', field: 'nodeId' },
      { name: 'Weight', field: 'weight' },
    ],
  }),

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

  .page {
    display: flex;
    align-content: flex-start;
  }

  .graph {
    position: relative;
    width: 100%;
    min-height: 800px;
    height: 100%;
  }
</style>