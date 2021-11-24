export function getOppositeDir(direction) {
  switch (direction) {
    case 'right':
      return 'left';
    case 'left':
      return 'right';
    default:
      return null;
  }
}

export function rotateSubtree(oldRoot, direction) {
  const opposite = getOppositeDir(direction);

  const child = oldRoot[opposite];
  const inner = child[direction];


  child[direction] = oldRoot
  oldRoot[opposite] = inner

  return child;
}

export function getSiblingNode(parent, nodeKey) {
  const { left, right } = parent;
  if (left?.key === nodeKey) return right;
  if (right?.key === nodeKey) return left;
  return null;
}
