<template>
  <div class="page">
    <div ref="graph" class="graph">
      <div
          class="hint"
          v-for="(hint, nodeId) in displayedNodeHints"
          :key="nodeId"
          :style="hintStyle(hint)"
      >
        {{ hint.weight }}
      </div>
    </div>
    <div>
      <Table
        title="Queue"
        key-field="nodeId"
        :columns="priorityQueueColumns"
        :values="priorityQueue"
      />
      <Table
        title="Visited"
        key-field="nodeId"
        :columns="visitedColumns"
        :values="visited"
      />
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, onUnmounted, ref, reactive } from 'vue';
import cytoscape from 'cytoscape';
import Table from '../../components/Table';
import graphData from '../../graphs/graph.json';
import graphStyle from './graphStyle';
import { delay } from '../../utils';


export default {
  name: 'FreeFormGraphPage',

  components: {
    Table,
  },

  methods: {
    hintStyle(hint) {
      return `
         top: ${hint.top}px;
         left: ${hint.left}px;
         width: ${hint.width}px;
         height: ${hint.height}px;
      `;
    }
  },

  computed: {
    displayedNodeHints() {
      const result = [];
      const nodeHints = this.nodeHints;
      for (let id in nodeHints) {
        const data = nodeHints[id];
        if (!data.weight) continue;
        result.push({ ...data, id });
      }
      return result;
    }
  },

  setup() {
    const priorityQueue = ref([]);
    const visited = ref([]);

    const nodeHints = ref({});

    function getNodeHint(node) {
      const id = node.data('id');
      return nodeHints.value[id];
    }

    function updateHintPosition(node) {
      const nodeHint = getNodeHint(node);
      setHintPosition(nodeHint, node);
    }

    function updateHint(node) {
      const nodeHint = getNodeHint(node);
      setHintData(nodeHint, node)
    }

    function getBoundingBox(node) {
      // const { x, y } = node.renderedPosition();
      // return { x2: x, y1: y };

      return node.renderedBoundingBox({
        includeNodes: true,
        includeEdges: false,
        includeLabels: false,
        includeOverlays: false,
      })
    }

    function setHint(node) {
      const { id, weight } = node.data();
      const { x2, y1 } = getBoundingBox(node);
      nodeHints.value[id] = reactive({
        weight,
        top: y1,
        left: x2,
      });
    }

    function setHintPosition(nodeHint, node) {
      const { x2, y1 } = getBoundingBox(node);

      nodeHint.top = y1;
      nodeHint.left = x2;
    }

    function setHintData(nodeHint, node) {
      const data = node.data();
      nodeHint.weight = data.weight;
    }

    const priorityQueueColumns = [
      { name: 'Node', field: 'nodeId' },
      { name: 'Weight', field: 'weight' },
    ];
    const visitedColumns = priorityQueueColumns;

    const getQueuedNodes = (graph) => graph.$('node[?isQueued][!isVisited]');
    const byWeight = (a, b) => a.data('weight') - b.data('weight');

    const pathFindingAlgorithm = async (graph, source, destination) => {
      console.log(source.data('id'), destination.data('id'));

      graph.$('node').data({
        isQueued: false,
        isVisited: false,
        isPath: false,
        weight: undefined,
      })

      const destinationId = destination.data('id');
      const sourceId = source.data('id');

      source.data({
        isQueued: true,
        weight: 0,
      });

      const step = 500;

      while (getQueuedNodes(graph).nonempty()) {
        const node = getQueuedNodes(graph).sort(byWeight)[0];

        node.data('isVisited', true);
        await delay(step);
        if (node.data('id') === destinationId) break;

        for (let neighbor of node.neighborhood('node[!isVisited]')) {
          const edge = node.edgesWith(neighbor);
          neighbor.data({
            isQueued: true,
            weight: node.data('weight') + edge.data('weight')
          })
          await delay(step);
          if (neighbor.data('id') === destinationId) break;
        }
      }

      const path = [destination];

      destination.data('isPath', true);
      await delay(step)

      let node = destination;
      while (node.data('id') !== sourceId) {
        let minNode = null;
        for (let neighbor of node.neighborhood('node')) {
          const weight = neighbor.data('weight')
          if (weight !== undefined && (!minNode || minNode.data('weight') > weight)) {
            minNode = neighbor;
          }
        }
        if (minNode === null) break;
        const edge = node.edgesWith(minNode);
        edge.move({ source: minNode.data('id'), target: node.data('id') });
        edge.data('isPath', true);

        node = minNode;
        path.push(minNode);
        minNode.data('isPath', true);
        await delay(step);
      }
      path.reverse()
      return path;
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

      window.graph = graph;

      let source = null;

      graph.on('tap', 'node', async (event) => {
        if (source === null) {
          source = event.target;
          return;
        }
        await pathFindingAlgorithm(graph, source, event.target);
        source = null;
      });

      const getNodeData = (node) => ({
        nodeId: node.data('id'),
        weight: node.data('weight'),
      });

      for (let node of graph.nodes()) {
        setHint(node);
      }

      graph.on('pan zoom resize', () => {
        for (let node of graph.nodes()) {
          updateHintPosition(node);
        }
      });

      graph.on('position', ({ target }) => {
        updateHintPosition(target);
      })

      graph.on('data', 'node', ({ target }) => {
        priorityQueue.value = getQueuedNodes(graph)
            .sort(byWeight).map(getNodeData);
        visited.value = graph.$('node[?isVisited]').map(getNodeData);

        updateHint(target);
      })
    })

    onUnmounted(() => {
      const instance = getCurrentInstance();
      instance.$graph.destroy();
    })

    return {
      priorityQueueColumns,
      priorityQueue,
      visited,
      visitedColumns,
      nodeHints,
    }
  }
}
</script>

<style scoped>
  .hint {
    position: absolute;
    color: #ffffff;
    padding: 2px 4px;
    background: #222222DD;
    z-index: 1;
  }

  .page {
    display: flex;
    align-content: flex-start;
  }

  .graph {
    position: relative;
    width: 1000px;
    min-width: 0;
    min-height: 800px;
    height: 100%;
    border: 1px red;
  }
</style>