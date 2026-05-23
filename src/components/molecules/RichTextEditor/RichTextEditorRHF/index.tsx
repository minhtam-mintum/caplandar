import { useEffect, useRef } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { $createParagraphNode, $getRoot, $insertNodes } from 'lexical';
import { useController, useFormContext } from 'react-hook-form';
import { Label } from 'app/components/atoms/Label';
import { EDITOR_THEME, EDITOR_NODES } from './const';
import { Toolbar } from './components/Toolbar';
import { LinkClickPlugin } from './components/Plugins/LinkClickPlugin';

interface ISyncPluginProps {
  value: string;
  onChange: (value: string) => void;
}

function SyncPlugin({ value, onChange }: ISyncPluginProps) {
  const [editor] = useLexicalComposerContext();
  const lastWrittenRef = useRef<string>(value);

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

interface IRichTextEditorRHFProps {
  name: string;
  label?: string;
  disabled?: boolean;
}

export function RichTextEditorRHF({ name, label, disabled }: IRichTextEditorRHFProps) {
  const { control } = useFormContext();
  const { field } = useController({ name, control });

  const initialConfig = {
    namespace: 'RichTextEditor',
    theme: EDITOR_THEME,
    onError: (error: Error) => {
      throw error;
    },
    nodes: EDITOR_NODES,
    editorState: null,
  };

  return (
    <div className='flex flex-col gap-1'>
      {label && <Label className='uppercase tracking-widest'>{label}</Label>}
      <div className='border border-outline-variant rounded-xl overflow-hidden'>
        <LexicalComposer initialConfig={initialConfig}>
          <Toolbar disabled={disabled} />
          <div className='relative overflow-y-auto max-h-64'>
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className={`px-4 py-3 min-h-32 text-body-md text-on-surface bg-transparent outline-none ${
                    disabled ? 'opacity-50 pointer-events-none' : ''
                  }`}
                />
              }
              placeholder={
                <p className='absolute top-3 left-4 text-body-md text-on-surface-variant/50 pointer-events-none select-none'>
                  Add notes…
                </p>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
          </div>
          <HistoryPlugin />
          <ListPlugin />
          <LinkPlugin />
          <LinkClickPlugin />
          <SyncPlugin value={field.value} onChange={field.onChange} />
        </LexicalComposer>
      </div>
    </div>
  );
}
