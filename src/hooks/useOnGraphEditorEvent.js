import { watch } from 'vue';

export default function useOnGraphEditorEvent(graphRef, modeRef, eventType, query, expectedMode, handler) {
  watch([graphRef, modeRef], ([graph, mode]) => {
    if (!graph) return;

    if (mode === expectedMode) {
      graph.on(eventType, query, handler);
      return;
    }

    graph.removeListener(eventType, query, handler);
  })
}