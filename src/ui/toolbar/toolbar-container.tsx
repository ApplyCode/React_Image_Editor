import {AnimatePresence} from 'framer-motion';
import {useStore} from '../../state/store';
import {MainToolbar} from './main-toolbar';

export function ToolbarContainer() {
  const activeTool = useStore(s => s.activeTool);

  return (
    <AnimatePresence initial={false}>
      <MainToolbar key="mainToolbar" />
    </AnimatePresence>
  );
}
