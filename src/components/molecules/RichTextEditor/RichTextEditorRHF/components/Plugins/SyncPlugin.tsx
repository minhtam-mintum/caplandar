import { useEffect, useRef } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { $createParagraphNode, $getRoot, $insertNodes } from 'lexical';

interface ISyncPluginProps {
  value: string;
  onChange: (value: string) => void;
}

export function SyncPlugin({ value, onChange }: ISyncPluginProps) {
  const [editor] = useLexicalComposerContext();
  const lastWrittenRef = useRef('');

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const html = $generateHtmlFromNodes(editor);
        lastWrittenRef.current = html;
        onChange(html);
      });
    });
  }, [editor, onChange]);

  useEffect(() => {
    if (value === lastWrittenRef.current) return;
    lastWrittenRef.current = value;
    editor.update(() => {
      const root = $getRoot();
      root.clear();
      if (!value) {
        root.append($createParagraphNode());
      } else {
        const parser = new DOMParser();
        const dom = parser.parseFromString(value, 'text/html');
        const nodes = $generateNodesFromDOM(editor, dom);
        $insertNodes(nodes);
      }
    });
  }, [value, editor]);

  return null;
}
