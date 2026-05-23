import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { EDIT_LINK_COMMAND } from '../../const';

export function LinkClickPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;
      e.preventDefault();

      if (e.ctrlKey || e.metaKey) {
        window.open(anchor.href, '_blank', 'noopener,noreferrer');
      } else {
        editor.dispatchCommand(EDIT_LINK_COMMAND, anchor.href);
      }
    };

    return editor.registerRootListener((newRoot, prevRoot) => {
      prevRoot?.removeEventListener('click', handleClick);
      newRoot?.addEventListener('click', handleClick);
    });
  }, [editor]);

  return null;
}
