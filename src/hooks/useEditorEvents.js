import { watch } from 'vue';

export default function seEditorEvents(graphRef, modeRef) {
  function addListener(eventType, query = null, expectedMode, handler) {
    watch([graphRef, modeRef], ([graph, mode]) => {
      if (!graph) return;

      if (mode === expectedMode) {

        graph.on(eventType, query, handler);
        return;
      }

      graph.removeListener(eventType, query, handler);
    })
  }

  return {
    mode: (expectedMode) => ({
      on(eventType, handler) {
        addListener(eventType, null, expectedMode, handler);
      },
      query: (query) => ({
        on(eventType, handler) {
          addListener(eventType, query, expectedMode, handler);
        }
      }),
    })
  }
}