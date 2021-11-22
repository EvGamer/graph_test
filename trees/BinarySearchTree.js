import BinaryNode from './BinaryNode';

export default class BinarySearchTree {
  constructor(elements={}, insertionOrder=null, compare=null) {
    this.compare = compare ?? this.constructor.compare;
    if (!insertionOrder) insertionOrder = Object.keys(elements);
    for (let key of insertionOrder) {
      const value = elements[key];
      if (!this.root) {
        this.root = this.createNode(key, value);
        continue;
      }
      this.insert(key, value);
    }
  }

  createNode(key, value) {
    return new BinaryNode(key, value);
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

  findNode(key) {
    return this._findNode(this.root, key);
  }

  _findNode(node, key) {
    let isFound = false;
    while (node && !isFound) {
      const comparison = this.compare(key, node.key);
      isFound = comparison === 0;
      if (!isFound)
        node = node[this._getDirection(comparison)];
    }
    return node;
  }

  _getDirection(comparison) {
    return comparison > 0 ? 'right' : 'left';
  }

  _getComparisonDirection(inKey, key) {
    return this._getDirection(this.compare(inKey, key));
  }

  insert(key, value) {
    this.insertNode(this.createNode(key, value));
  }

  insertNode(newNode) {
    this._insertNode(this.root, newNode);
  }

  _insertNode(node, newNode) {
    let child = node;
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
