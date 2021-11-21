import cytoscape from "cytoscape";
import dagre from 'cytoscape-dagre';

import { BinarySearchTree } from './trees';

cytoscape.use(dagre);

function mountGraph() {
  const tree = new BinarySearchTree([3, 1, 0, 2, 5, 4, 6]);

  const style = [
    {
      selector: 'node',
      style: {
        'background-color': '#11479e'
      }
    },

    {
      selector: 'edge',
      style: {
        'width': 4,
        'target-arrow-shape': 'triangle',
        'line-color': '#9dbaea',
        'target-arrow-color': '#9dbaea',
        'curve-style': 'bezier'
      }
    }
  ]

  const cy = window.cy = cytoscape({
    container: document.getElementById('graph'),

    boxSelectionEnabled: false,
    autounselectify: true,

    layout: {
      name: 'dagre'
    },

    style,

    elements: tree.toGraph(),
  });

}


window.addEventListener('DOMContentLoaded', mountGraph)