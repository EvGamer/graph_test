import { getCurrentInstance, onMounted, onUnmounted, shallowRef } from 'vue';
import cytoscape from 'cytoscape';

export default function useGraph({ containerRefName, ...settings }) {
  const graphRef = shallowRef(null);

  onMounted(() => {
    const { refs } = getCurrentInstance();
    settings.container = refs[containerRefName];

    graphRef.value = cytoscape(settings);
  })

  onUnmounted(() => {
    graphRef.value.destroy();
  })

  return graphRef;
}