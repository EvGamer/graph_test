export default [
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
      'target-arrow-color': '#BCBEC0',
      'line-color': '#bcbec0',
      'curve-style': 'bezier'
    }
  }
]