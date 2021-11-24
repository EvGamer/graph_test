import cytoscape from "cytoscape";
import dagre from 'cytoscape-dagre';

import { BinarySearchTree, RedBlackTree } from './trees';
import { rotateSubtree } from './trees/utils';

cytoscape.use(dagre);
const RIGHT_MOUSE_BUTTON = 1;

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

  const tree = new RedBlackTree(cy, {
    3: 'three',
    1: 'one',
    0: 'not',
    2: 'two',
    5: 'five',
    4: 'four',
    6: 'six',
  }, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  tree.root.isRed = false;

  let tapAction = null;
  // window.addEventListener('mousedown', (event) => {
  //   if (event.button !== RIGHT_MOUSE_BUTTON) return;
  //   tapAction = null;
  // })


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