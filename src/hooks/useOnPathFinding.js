import { unref } from 'vue';
import { EDITOR_MODES } from '../enums';
import useOnGraphEditorEvent from './useOnGraphEditorEvent';
import { makeConnectionHandler } from '../utils';

export default function useOnPathFinding(graphRef, mode, algorithm) {
  useOnGraphEditorEvent(graphRef, mode, 'tap', 'node', EDITOR_MODES.path,
    makeConnectionHandler(async (source, target) => {
       await algorithm(unref(graphRef), source, target);
    })
  );
}