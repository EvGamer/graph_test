export default class BinaryNode {
  static *dataProperties() {
    yield 'value';
  }

  static create(graph, id, value, left, right) {
    graph.add({
      group: 'nodes',
      data: { id, value },
    });
    return new this(graph, id, left, right);
  }

  createDataProperty(propertyName) {
    Object.defineProperty(this, propertyName, {
      get: () => this._node.data(propertyName),
      set: (newValue) => this._node.data(propertyName, newValue),
    })
  }

  constructor(graph, id, left=null, right=null) {
    this.graph = graph;
    this.key = id;
    this.leftEdgeId = `${id}_left`;
    this.rightEdgeId = `${id}_right`;
    if (left) this.left = left;
    if (right) this.right = right;
    for (const key in this.constructor.dataProperties()) {
      this.createDataProperty(key);
    }
  }

  getEdgeId(direction) {
    switch (direction) {
      case 'left':
        return this.leftEdgeId;
      case 'right':
        return this.rightEdgeId;
      default:
        return null
    }
  }

  getChild(direction) {
    const id = this.getEdgeId(direction);
    const edge = this.graph.$id(id);
    if (!edge.isEdge()) return null;
    return new BinaryNode(this.graph, edge.data('target'))
  }

  connectTo(node, direction='left') {
    if (!direction) return;
    if (node == null) {
      const edge = this.graph.$id(this.getEdgeId(direction));
      if (edge.isEdge()) edge.remove();
      return;
    }
    const id = this.getEdgeId(direction);
    const edge = this.graph.$id(id);
    if (edge.isEdge()) {
      edge.move({ target: node.key });
      return;
    }
    this.graph.add({
      group: 'edges',
      data: { id, source: this.key, target: node.key },
    })
  }

  get _node() {
    return this.graph.$(this.key);
  }
  get left() {
    return this.getChild('left');
  }

  set left(node) {
    this.connectTo(node, 'left');
  }

  get right() {
    return this.getChild('right');
  }

  set right(node) {
    this.connectTo(node, 'right');
  }

  get parentEdge() {
    const edges = this.graph.edges(`[target = "${this.key}"]`);

    return edges[0];
  }

  get parent() {
    const edge = this.parentEdge;
    if (edge)
      return new BinaryNode(this.graph, edge.data('source'));
    return null;
  }
}