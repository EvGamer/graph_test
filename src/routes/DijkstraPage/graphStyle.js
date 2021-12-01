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
    selector: 'node[?isQueued]',
    style: {
      'background-color': '#0260E8',
      'border-color': '#5199FF',
    }
  },
  {
    selector: 'node[?isVisited]',
    style: {
      'background-color': '#00848C',
      'border-color': '#76FEC5',
    }
  },
  {
    selector: 'node[?isPath]',
    style: {
      'background-color': '#D2AA1B',
      'border-color': '#F4EDB2',
    }
  },
  {
    selector: 'edge',
    style: {
      'width': edge => {
        const weight = edge.data('weight') || 0;
        return 10 - weight * 2;
      },
      'line-color': '#bcbec0',
      'target-arrow-color': '#BCBEC0',
      'curve-style': 'bezier'
    }
  },
]