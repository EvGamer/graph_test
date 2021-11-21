import BinaryNode from './BinaryNode';

export default class BinarySearchTree {
  constructor(elements=[], compare=null) {
    this.compare = compare ?? this.constructor.compare;
    this.nodeCount = 0;
    this.root = this.createNode(elements[0]);

    for (let i=1; i < elements.length; i++) {
      this.insert(elements[i]);
    }
  }

  createNode(value) {
    const node = new BinaryNode(value);
    node.id = this.nodeCount;
    this.nodeCount ++;
    return node;
  }

  toGraph(prefix='') {
    const nodes = [];
    const addNode = ({ id, value }) => {
      nodes.push({
        data: { id, value }
      })
    }
    addNode(this.root);
    
    const stack = [this.root];

    const edges = [];
    const addEdge = (node, child) => {
      edges.push({
        data: { source: node.id, target: child.id },
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

  findNode(value) {
    return this._findNode(this.root, value);
  }

  _findNode(node, value) {
    if (node == null) return null;
    const comparison = this.compare(node.value, value);
    if (comparison === 0) return node;
    const child = node[this._getDirection(comparison)];
    return this._findNode(child, value)
  }

  _getDirection(comparison) {
    return comparison > 0 ? 'right' : 'left';
  }

  insert(value) {
    this.insertNode(this.createNode(value));
  }

  insertNode(newNode) {
    this._insertNode(this.root, newNode);
  }

  _insertNode(node, newNode) {
    const comparison = this.compare(node.value, newNode.value);
    this._insertNodeAt(node, this._getDirection(comparison), newNode);
  }

  _insertNodeAt(node, direction, newNode) {
    if (node[direction]) {
      this._insertNode(node[direction], newNode);
      return;
    };
    node[direction] = newNode;
  }

  static compare(nodeValue, otherNodeValue) {
    if (nodeValue > otherNodeValue) return 1;
    if (nodeValue < otherNodeValue) return -1;
    return 0;
  }
}
