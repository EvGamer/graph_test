import BinaryNode from './BinaryNode';
import { BinarySearchTree } from './index';
import { getOppositeDir, getSiblingNode, rotateSubtree } from './utils';
import { delay } from '../utils';

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
    this.createDataProperties(['isRed', 'isHighlighted']);
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
      path.push([node, direction]);
    }
    node[direction] = newNode;

    // balancing
    while (path.length >= 2) {
      let [parent, dirToNode] = path.pop();

      if (!parent.isRed) break;

      let [grandParent, dirToParent] = path.pop();

      const uncle = getSiblingNode(grandParent, parent.key);

      if (uncle?.isRed) {
        grandParent.isRed = true;
        parent.isRed = false;
        uncle.isRed = false;
        continue;
      }

      // turning LR case to LL case and RL case into RR case
      if (dirToNode !== dirToParent) {
        parent = rotateSubtree(parent, getOppositeDir(dirToNode));
        grandParent[dirToParent] = parent;
      }

      // balancing LL and RR cases
      parent.isRed = false
      grandParent.isRed = true
      grandParent = rotateSubtree(grandParent, getOppositeDir(dirToParent));

      // attaching rotated subtree
      if (path.length > 0) {
        const [grandGrandParent, direction] = path[path.length - 1];
        grandGrandParent[direction] = grandParent;
      } else {
        this.root = grandParent;
      }
      break;
    }
    this.root.isRed = false;
  }

  async animInsertNode(newNode) {
    const duration = 1000;
    if (!this.root) {
      this.root = newNode;
      this.root.isRed = false;
      await this.arrange();
      await delay(duration);
      return;
    }

    let child = this.root;
    let direction, node;
    const path = [];

    while (child) {
      node = child;
      node.isHighlighted = true;
      await delay(300);

      node.isHighlighted = false;
      direction = this._getComparisonDirection(newNode.key, node.key);
      child = node[direction];
      path.push([node, direction]);
    }
    node[direction] = newNode;
    await this.arrange();
    await delay(duration);

    // balancing
    while (path.length >= 2) {
      let [parent, dirToNode] = path.pop();

      if (!parent.isRed) break;

      let [grandParent, dirToParent] = path.pop();

      const uncle = getSiblingNode(grandParent, parent.key);

      if (uncle?.isRed) {
        grandParent.isRed = true;
        parent.isRed = false;
        uncle.isRed = false;
        await delay(duration)
        continue;
      }

      // turning LR case to LL case and RL case into RR case
      if (dirToNode !== dirToParent) {
        const rotated = parent;
        rotated.isHighlighted = true;
        parent = rotateSubtree(parent, getOppositeDir(dirToNode));
        grandParent[dirToParent] = parent;
        await this.arrange();
        await delay(duration);
        rotated.isHighlighted = false;
      }

      // balancing LL and RR cases
      parent.isRed = false
      grandParent.isRed = true
      await delay(duration)
      const rotated = grandParent
      rotated.isHighlighted = true;
      grandParent = rotateSubtree(grandParent, getOppositeDir(dirToParent));

      // attaching rotated subtree
      if (path.length > 0) {
        const [grandGrandParent, direction] = path[path.length - 1];
        grandGrandParent[direction] = grandParent;
      } else {
        this.root = grandParent;
      }
      await this.arrange();
      rotated.isHighlighted = false;
      await delay(duration);
      break;
    }
    this.root.isRed = false;
    await delay(duration);
  }
}