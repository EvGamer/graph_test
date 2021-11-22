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
    console.log({ nodes, edges });

    return { nodes, edges };
  }

  find(key) {
    return this.findNode(key).value;
  }

  findNode(key) {
    return this._findNode(this.root, key);
  }

  _findNode(node, key) {
    if (node == null) return null;
    const comparison = this.compare(key, node.key);
    if (comparison === 0) return node;
    const child = node[this._getDirection(comparison)];
    return this._findNode(child, key)
  }

  _getDirection(comparison) {
    return comparison > 0 ? 'right' : 'left';
  }

  insert(key, value) {
    this.insertNode(this.createNode(key, value));
  }

  insertNode(newNode) {
    this._insertNode(this.root, newNode);
  }

  _insertNode(node, newNode) {
    const comparison = this.compare(newNode.key, node.key);
    this._insertNodeAt(node, this._getDirection(comparison), newNode);
  }

  _insertNodeAt(node, direction, newNode) {
    if (node[direction]) {
      this._insertNode(node[direction], newNode);
      return;
    }
    node[direction] = newNode;
  }

  static compare(key, otherKey) {
    if (key > otherKey) return 1;
    if (key < otherKey) return -1;
    return 0;
  }
}
