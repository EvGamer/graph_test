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
import { toRef } from 'vue';
import { EDITOR_MODES } from '../enums';
import { useEditorEvents } from '../hooks';

export default {
  name: 'Toolbar',

  props: ['graph', 'mode'],

  setup(props, { emit }) {

    const editorEvents = useEditorEvents(
        toRef(props, 'graph'),
        toRef(props, 'mode')
    )

    const addNode = (position) =>
      props.graph.add({ group: 'nodes', position });

    const connect = (source, target) =>
      props.graph.add({
        group: 'edges',
        data: {
          source: source.data('id'),
          target: target.data('id')
        },
      })

    editorEvents.mode(EDITOR_MODES.addNode).on('mousedown', (event) => {
      const didClickNode = Boolean(event.target.isNode?.());
      if (didClickNode) return;
      addNode(event.position);
    })

    let source = null;

    const withSourceNode = (node, callback) => {
      console.log(node);
      if (!source && node?.isNode()) {
        node.data('isQueued', true);
        source = node;
        return;
      }
      callback(source, node);
      source.data('isQueued', false);
      source = null;
    }


    editorEvents.mode(EDITOR_MODES.connect).query('node')
      .on('tap', ({ target }) => {
        console.log('cnct')
        withSourceNode(target, (source) => connect(source, target))
      })

    editorEvents.mode(EDITOR_MODES.addConnectedNode)
      .on('mousedown', ({ target, position }) => {
        withSourceNode(target, (source) => {
          if (!target.isNode?.()) {
            target = addNode(position);
          }
          const edge = connect(source, target);
          console.log(edge);
        })
      })

    const deleteMode = editorEvents.mode(EDITOR_MODES.remove)

    const handleRemove = (event) => {
      props.graph.remove(event.target);
    }
    deleteMode.query('nodes').on('tap', handleRemove)
    deleteMode.query('edges').on('tap', handleRemove)

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