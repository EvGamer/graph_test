<template>
  <div class="toolbar">
    <button class="bi-cursor" @click="setMode(options.path)" />
    <button @click="setMode(options.addNode)">
      <i class="bi-plus-circle" />
    </button>
    <button @click="setMode(options.addConnectedNode)">
      <i class="bi-node-plus" />
    </button>
    <button class="bi-share-fill" @click="setMode(options.connect)" />
    <button class="bi-dash-circle-dotted" @click="setMode(options.remove)" />
  </div>
</template>

<script>
import { toRef, watch } from 'vue';
import { EDITOR_MODES } from '../enums';
import { useEditorEvents } from '../hooks';

export default {
  name: 'Toolbar',

  props: ['graph', 'mode'],

  setup(props, { emit }) {
    const options = EDITOR_MODES;
    const graphRef = toRef(props, 'graph');

    const editorEvents = useEditorEvents(
        graphRef,
        toRef(props, 'mode')
    )

    let maxId = 0;

    watch(graphRef, graph => {
      if (!graph) return
      for (let node of graph.nodes()) {
        const numId = parseInt(node.data('id'));
        if (Number.isNaN(numId)) continue;

        if (numId > maxId) maxId = numId;
      }
    })

    const addNode = (position) =>
      props.graph.add({
        group: 'nodes',
        position,
        data: { id: ++maxId }
      });

    const connect = (source, target) =>
      props.graph.add({
        group: 'edges',
        data: {
          weight: 1,
          source: source.data('id'),
          target: target.data('id')
        },
      })

    editorEvents.mode(options.addNode).on('mousedown', (event) => {
      const didClickNode = Boolean(event.target.isNode?.());
      if (didClickNode) return;
      addNode(event.position);
    })

    let source = null;

    const withSourceNode = (node, callback) => {
      if (node === source) {
        source = null;
        source.data('isQueued', false);
        return;
      }
      if (!source && node?.isNode()) {
        node.data('isQueued', true);
        source = node;
        return;
      }
      callback(source, node);
      source.data('isQueued', false);
      source = null;
    };


    editorEvents.mode(options.connect).query('node')
      .on('tap', ({ target }) => {
        withSourceNode(target, (source) => connect(source, target))
      });

    editorEvents.mode(options.addConnectedNode)
      .on('mousedown', ({ target, position }) => {
        if (!target.isNode?.()) {
          const newNode = addNode(position);
          connect(source, newNode);
          source = newNode;
          return;
        }
        source = target;
      });

    const deleteMode = editorEvents.mode(options.remove);

    const handleRemove = (event) => {
      props.graph.remove(event.target);
    }
    deleteMode.query('node').on('tap', handleRemove)
    deleteMode.query('edge').on('tap', handleRemove)

    return {
      setMode(mode) {
        emit('set-mode', mode);
        console.log('set mode', mode);
      },
      options: EDITOR_MODES,
    }
  }
}
</script>

<style scoped>
.toolbar {
  display: flex;
}

button {
  height: 50px;
  width: 50px;
  background: #222222;
  border-color: #bcbec0;
  color: #bcbec0;
  font-size: 30px
}

</style>