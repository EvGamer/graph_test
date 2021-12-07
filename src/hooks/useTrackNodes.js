import { reactive, ref, watch } from 'vue';

export default function useTrackNodes(graphRef, blankNodeData) {
  const proxies = ref({})

  function getProxy(node) {
    const id = node.data('id');
    return proxies.value[id];
  }

  function copyNodeData(proxy, node) {
    const data = node.data();
    for (let key of Object.keys(blankNodeData)) {
      proxy[key] = data[key];
    }
    return proxy;
  }

  function copyNodePosition(proxy, node) {
    const { x2, y1 } = getBoundingBox(node);

    proxy.top = y1;
    proxy.left = x2;
    return proxy;
  }

  function updateProxyPosition(node) {
    copyNodePosition(getProxy(node), node);
  }

  function updateProxyData(node) {
    copyNodeData(getProxy(node), node)
  }


  function initProxy(node) {
    const id = node.data('id');

    const nodeData = { ...blankNodeData };
    copyNodeData(nodeData, node);
    copyNodePosition(nodeData, node);

    proxies.value[id] = reactive(nodeData);
  }

  watch(graphRef, graph => {
    console.log(graph);
    if (!graph) return;

    for (let node of graph.nodes()) {
      initProxy(node);
    }

    graph.on('pan zoom resize', () => {
      for (let node of graph.nodes()) {
        updateProxyPosition(node);
      }
    });

    graph.on('position', 'node', ({ target }) => {
      updateProxyPosition(target);
    })

    graph.on('data', 'node', ({ target }) => {
      updateProxyData(target);
    })
  })

  return proxies;
}

function getBoundingBox(node) {
  return node.renderedBoundingBox({
    includeNodes: true,
    includeEdges: false,
    includeLabels: false,
    includeOverlays: false,
  })
}
