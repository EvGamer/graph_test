export function rotateSubtree(oldRoot, direction='left') {
  const opposite = direction === 'right' ? 'left' : 'right';

  const child = oldRoot[opposite];
  const inner = child[direction];


  child[direction] = oldRoot
  oldRoot[opposite] = inner

  return child;
}