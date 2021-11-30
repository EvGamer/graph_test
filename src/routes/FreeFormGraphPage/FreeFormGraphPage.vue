<template>
  <div class="page">
    <div ref="graph" class="graph" />
    <div>
      <Table
        title="Nodes to see"
        key-field="nodeId"
        :columns="priorityQueueColumns"
        :values="priorityQueue"
      />
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, onUnmounted, ref } from 'vue';
import cytoscape from 'cytoscape';
import Table from '../../components/Table';
import graphData from '../../graphs/graph.json';
import graphStyle from './graphStyle';


export default {
  name: 'FreeFormGraphPage',

  components: {
    Table,
  },

  setup() {
    const priorityQueue = ref([]);

    const priorityQueueColumns = [
      { name: 'Node', field: 'nodeId' },
      { name: 'Weight', field: 'weight' },
    ];

    const pathFindingAlgorithm = (source, destination) => {
      console.log(source.data('id'), destination.data('id'));
    }

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
      const graph = instance.$graph;

      let source = null;

      graph.on('tap', 'node', function(event) {
        if (source === null) {
          source = event.target;
          source.data('isHighlighted', true);
          return;
        }
        pathFindingAlgorithm(source, event.target);
        source.data('isHighlighted', false);
        source = null;
      });
    })

    onUnmounted(() => {
      const instance = getCurrentInstance();
      instance.$graph.destroy();
    })

    return {
      priorityQueueColumns,
      priorityQueue,
    }
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