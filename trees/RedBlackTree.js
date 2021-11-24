import BinaryNode from './BinaryNode';
import { BinarySearchTree } from './index';
import { getOppositeDir, getSiblingNode, rotateSubtree } from './utils';

class RedBlackNode extends BinaryNode {
  static create(graph, id, value, left, right) {
    graph.add({
      group: 'nodes',
      data: { id, value, isRed: true },
    });
    return new this(graph, id, left, right);
  }

  constructor(...args) {
    super(...args);
    this.createDataProperties(['isRed']);
  }
}

export default class RedBlackTree extends BinarySearchTree {
  createNode(key, value) {
    return RedBlackNode.create(this.graph, key, value)
  }

  insertNode(newNode) {
    if (!this.root) {
      this.root = newNode;
      this.root.isRed = false;
      return;
    }

    let child = this.root;
    let direction, node;
    const path = [];

    while (child) {
      node = child;
      direction = this._getComparisonDirection(newNode.key, node.key);
      child = node[direction];
      path.push({ from: node, direction });
    }
    node[direction] = newNode;

    let firstIteration = true;
    // balancing
    while (path.length >= 2) {
      const toNode = path.pop();
      let parent = toNode.from;

      if (!parent.isRed && firstIteration) return;
      firstIteration = false;

      const toParent = path.pop();
      let grandParent = toParent.from;

      const uncle = getSiblingNode(grandParent, parent.key);

      if (uncle?.isRed) {
        grandParent.isRed = true;
        parent.isRed = false;
        uncle.isRed = false;
        continue;
      }

      // turning LR case to LL case and RL case into RR case
      if (toNode.direction !== toParent.direction) {
        const opposite = getOppositeDir(toNode.direction);

        parent = rotateSubtree(toNode.from, opposite);
        grandParent[toParent.direction] = parent;
      }

      // balancing LL and RR cases
      parent.isRed = false
      grandParent.isRed = true
      grandParent = rotateSubtree(grandParent, getOppositeDir(toParent.direction));

      // attaching rotated subtree
      if (path.length > 0) {
        const { from, direction } = path[path.length - 1];
        from[direction] = grandParent;
      } else {
        this.root = grandParent;
      }
    }
  }

}