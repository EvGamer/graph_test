<template>
  <div ref="graph" class="graph">
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, onUnmounted } from 'vue';
import cytoscape from 'cytoscape';

import dspData from './DSPData.json';
import graphStyle from './graphStyle';

function createItemEdge(recipe, edgeType, itemId) {
  const isOut = edgeType === 'out';
  return ({
    data: {
      id: `${recipe.id}_${itemId}_${edgeType}`,
      type: 'output',
      source: isOut ? recipe.id : itemId,
      target: isOut ? itemId : recipe.id,
      amount: recipe[edgeType][itemId],
    }
  })
}

function getRecipeItemGroupEdges(recipe, edgeType) {
  if (!recipe[edgeType]) return [];

  return Object.keys(recipe[edgeType])
      .map((itemId) => createItemEdge(recipe, edgeType, itemId));
}

function omitTech(items) {
  return items.filter(item => !item.isTechnology);
}

function getRecipeEdges(recipes) {
  const edges = [];

  for (let recipe of omitTech(recipes)) {
    edges.push(...getRecipeItemGroupEdges(recipe, 'in'));
    edges.push(...getRecipeItemGroupEdges(recipe, 'out'));
  }

  console.log(edges);

  return edges;
}

const LAYOUT_SETTINGS = {
  name: 'cise',
}

export default {
  name: 'DSPRecipes',
  setup() {
    onMounted(() => {
      const instance = getCurrentInstance();

      const graph = cytoscape({
        container: instance.refs.graph,
        layout: LAYOUT_SETTINGS,
        boxSelectionEnabled: false,
        autounselectify: false,
        style: graphStyle,

        elements: {
          edges: getRecipeEdges(dspData.recipes),
          nodes: [
            ...dspData.items.map((item) => ({
              data: {
                type: 'item',
                id: item.id,
                name: item.name,
              },
            })),
            ...omitTech(dspData.recipes).map((recipe) => ({
              data: {
                type: 'recipe',
                id: recipe.id,
                name: recipe.name,
              }
            }))
          ],
        }
      });


      instance.$graph = graph;
    })

    onUnmounted(() => {
      const instance = getCurrentInstance();
      instance.$graph.destroy();
    })
  }
}
</script>


<style scoped>
  .graph {
    position: relative;
    width: 100%;
    min-height: 800px;
    height: 100%;
  }
</style>
