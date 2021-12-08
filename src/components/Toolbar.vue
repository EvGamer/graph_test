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
    <button class="bi-dash-circle-dotted" @click="setMode(options.removeNode)" />
  </div>
</template>

<script>
import { toRef } from 'vue';
import { EDITOR_MODES } from '../enums';
import { useOnGraphEditorEvent } from '../hooks';

export default {
  name: 'Toolbar',

  props: ['graph', 'mode'],

  setup(props, { emit }) {
    const graph = toRef(props, 'graph');
    const mode = toRef(props, 'mode');

    useOnGraphEditorEvent(graph, mode, 'mousedown', null, EDITOR_MODES.addNode, (event) => {
      const didClickNode = Boolean(event.target.isNode?.());
      console.log(didClickNode)
      if (didClickNode) return;
      props.graph.add({
        group: 'nodes',
        position: event.position,
      })
    })

    return {
      setMode(mode) {
        emit('set-mode', mode);
        console.log('set mode');
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