import cytoscape from "cytoscape";
import dagre from 'cytoscape-dagre';

import { RedBlackTree } from './trees';
import { rotateSubtree } from './trees/utils';
import { fillEveryKeyWithValue, shuffleRange } from './utils';

cytoscape.use(dagre);

function mountGraph() {



  const style = [
    {
      selector: 'node',
      style: {
        'background-color': '#231F20',
        'border-width': '2px',
        'border-color': '#58595B',
        'label': 'data(id)',
        'color': '#FFFFFF',
        'text-valign': 'center',
      }
    },
    {
      selector: 'node[?isRed]',
      style: {
        'background-color': '#922D25',
        'border-color': '#D8664D',
      }
    },
    {
      selector: 'node[?isHighlighted]',
      style: {
        'background-color': '#00848C',
        'border-color': '#76FEC5',
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 4,
        'target-arrow-shape': 'triangle',
        'line-color': '#bcbec0',
        'target-arrow-color': '#BCBEC0',
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

    elements: {
      edges: [],
      nodes: [],
    },
  });

  const keys = shuffleRange(0, 20);
  const tree = new RedBlackTree(cy, {});

  async function insertAll() {
    for (let key of keys) {
      await tree.animInsert(key, 'dummy')
    }
  }
  insertAll().then(() => console.log('done'));

  let tapAction = null;


  function addHandlerSetRotation(buttonId, rotationDirection) {
    document.getElementById(buttonId).addEventListener('click', () => {
      console.log(buttonId);
      tapAction = (event) => {
        const { parent, direction, node } = tree.findNodeAndParent(event.target.data('id'));
        tree.attachToParent(rotateSubtree(node, rotationDirection), parent, direction);
        tree.layout.run()
      }
    })
  }
  addHandlerSetRotation('rotate_left', 'left');
  addHandlerSetRotation('rotate_right', 'right');

  cy.on('tap', 'node', (event) => {
    console.log('tap', event.target.data('id'));
    if (tapAction) {
      tapAction(event)
    }
  })

}


window.addEventListener('DOMContentLoaded', mountGraph)