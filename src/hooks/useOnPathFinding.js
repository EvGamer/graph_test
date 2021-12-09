import { unref } from 'vue';
import { EDITOR_MODES } from '../enums';
import useEdtiorEvents from './useEditorEvents';
import { makeConnectionHandler } from '../utils';

export default function useOnPathFinding(graphRef, modeRef, algorithm) {
  useEdtiorEvents(graphRef, modeRef)
    .mode(EDITOR_MODES.path)
    .query('node')
    .on('tap', makeConnectionHandler(async (source, target) => {
      await algorithm(unref(graphRef), source, target);
    }))
}