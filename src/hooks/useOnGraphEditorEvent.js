import { unref, watchEffect } from 'vue';

export default function useOnGraphEditorEvent(graph, mode, eventType, query, expectedMode, handler) {
  graph = unref(graph);

  watchEffect(() => {
    const modeValue = unref(mode);

    if (modeValue === expectedMode) {
      graph.on(eventType, query, handler);
      return;
    }

    graph.removeListener(eventType, query, handler);
  })
}