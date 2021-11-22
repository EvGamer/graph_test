export function rotateSubtree(oldRoot, direction='left') {
  const opposite = direction === 'right' ? 'left' : 'right';

  const newRoot = oldRoot[opposite];
  const pulledNode = oldRoot[direction];

  newRoot[direction] = oldRoot
  oldRoot[opposite] = pulledNode

  return newRoot;
}