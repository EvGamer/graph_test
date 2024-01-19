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

function filterToItemsProductionChain({ items, recipes, resultItems, baseItems = [] }) {
  const resultItemSet = new Set(resultItems);
  const baseItemSet = new Set(baseItems);
  console.log('items', items);
  const toVisit = items.filter(item => resultItemSet.has(item.id));
  console.log('toVisit', toVisit);
  console.log('iron-vein', items.filter('iron-vein'));
  const filteredItems = [];
  const filteredRecipes = [];

  // depth first
  while (toVisit.length > 0) {
    const item = toVisit.pop();
    console.log('pop', item)
    filteredItems.push(item);

    console.log('item.id', item.id)

    if (baseItemSet.has(item) || true) continue;

    const recipesForItem = recipes.filter(recipe => recipe.out[item.id]);
    filteredRecipes.push(...recipesForItem);

    if (!recipes.in) continue;
    toVisit.push(...items.filter(input => recipes.in[input.id]))
  }

  return { items, recipes };
}

function getNodesFromDspData({ items, recipes }) {
  return {
    ...items.map((item) => ({
      data: {
        type: 'item',
        id: item.id,
        name: item.name,
      },
    })),
    ...recipes.map((recipe) => ({
      data: {
        type: 'recipe',
        id: recipe.id,
        name: recipe.name,
      }
    }))
  };
}

const LAYOUT_SETTINGS = {
  name: 'cise',
}

export default {
  name: 'DSPRecipes',
  setup() {
    onMounted(() => {
      const instance = getCurrentInstance();

      const filteredData = filterToItemsProductionChain({
        items: dspData.items,
        recipes: omitTech(dspData.recipes),
        resultItems: ['processor'],
        baseItems: ['iron-ingot']
      });

      const graph = cytoscape({
        container: instance.refs.graph,
        layout: LAYOUT_SETTINGS,
        boxSelectionEnabled: false,
        autounselectify: false,
        style: graphStyle,

        elements: {
          edges: getRecipeEdges(filteredData.recipes),
          nodes: getNodesFromDspData(filteredData),
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
