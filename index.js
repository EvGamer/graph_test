import cytoscape from "cytoscape";
import dagre from 'cytoscape-dagre';

import { BinarySearchTree } from './trees';
import { rotateSubtree } from './trees/utils';

cytoscape.use(dagre);
const RIGHT_MOUSE_BUTTON = 1;

function mountGraph() {



  const style = [
    {
      selector: 'node',
      style: {
        'background-color': '#11479e',
        'label': 'data(id)',
        'color': '#FFFFFF',
        'text-valign': 'center',
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

    elements: {
      edges: [],
      nodes: [],
    },
  });

  const tree = new BinarySearchTree(cy, {
    3: 'three',
    1: 'one',
    0: 'not',
    2: 'two',
    5: 'five',
    4: 'four',
    6: 'six',
  }, [3, 1, 0, 2, 5, 4, 6])

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