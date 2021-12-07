import { EDITOR_MODES } from '../enums';
import useOnGraphEditorEvent from './useOnGraphEditorEvent';
import { makeConnectionHandler } from '../utils';

export default function useOnPathFinding(graph, mode, algorithm) {
  useOnGraphEditorEvent(graph, mode, 'tap', 'node', EDITOR_MODES.path,
    makeConnectionHandler(async (source, target) => {
       await algorithm(graph, source, target);
    })
  );
}