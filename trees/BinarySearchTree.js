import BinaryNode from './BinaryNode';

export default class BinarySearchTree {
  constructor(graph, elements={}, insertionOrder=null, compare=null) {
    this.graph = graph;

    this.compare = compare ?? this.constructor.compare;
    if (!insertionOrder) insertionOrder = Object.keys(elements);

    for (let key of insertionOrder) {
      this.insert (key, elements[key]);
    }
  }

  createNode(key, value) {
    return BinaryNode.create(this.graph, key, value);
  }

  toGraph(prefix='') {
    const nodes = [];
    const addNode = ({ key, value }) => {
      nodes.push({
        data: { id: key, value }
      })
    }
    addNode(this.root);
    
    const stack = [this.root];

    const edges = [];
    const addEdge = (node, child) => {
      edges.push({
        data: { source: node.key, target: child.key },
      })
    }

    while (stack.length > 0) {
      const node = stack.pop();
      for (let dir of ['left', 'right']) {
        const child = node[dir];
        if (!child) continue;
        stack.push(child);
        addEdge(node, child);
        addNode(child);
      }
    }

    return { nodes, edges };
  }

  find(key) {
    return this.findNode(key).value;
  }

  findNodeAndParent(key) {
    let parent = null;
    let node = this.root;
    let isFound = false;
    let direction = null;

    while (node && !isFound) {
      const comparison = this.compare(key, node.key);
      isFound = comparison === 0;
      if (!isFound) {
        direction = this._getDirection(comparison);
        parent = node;
        node = node[direction];
      }
    }

    return { node, parent, direction }
  }

  findNode(key) {
    return this.findNodeAndParent(key).node;
  }

  attachToParent(node, parent = null, direction = null) {
    if (parent === null) {
      this.root = node;
      return;
    }
    parent[direction] = node
  }

  _getDirection(comparison) {
    return comparison > 0 ? 'right' : 'left';
  }

  _getComparisonDirection(inKey, key) {
    return this._getDirection(this.compare(inKey, key));
  }

  insert(key, value) {
    const node = this.createNode(key, value);
    this.insertNode(node);
  }

  insertNode(newNode) {
    if (!this.root) {
      this.root = newNode;
      return;
    }
    let child = this.root;
    let node;
    let direction;
    while (child) {
      node = child;
      direction = this._getComparisonDirection(newNode.key, node.key);
      child = node[direction];
    }
    node[direction] = newNode;
  }

  static compare(key, otherKey) {
    if (key > otherKey) return 1;
    if (key < otherKey) return -1;
    return 0;
  }
}
