import { useCallback, useEffect, useRef, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  type NodeKey,
} from 'lexical';
import {
  $isListNode,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { $createCodeNode, CodeNode } from '@lexical/code';
import { $getNearestNodeOfType } from '@lexical/utils';
import { Bold, Code, Italic, Link2, List, Underline, X } from 'lucide-react';
import { EDIT_LINK_COMMAND } from '../../const';

interface IToolbarProps {
  disabled?: boolean;
}

export function Toolbar({ disabled }: IToolbarProps) {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isList, setIsList] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const linkInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          setIsBold(false);
          setIsItalic(false);
          setIsUnderline(false);
          setIsList(false);
          setIsLink(false);
          setIsCode(false);
          return;
        }

        setIsBold(selection.hasFormat('bold'));
        setIsItalic(selection.hasFormat('italic'));
        setIsUnderline(selection.hasFormat('underline'));

        const anchorNode = selection.anchor.getNode();
        setIsList($getNearestNodeOfType(anchorNode, ListNode) !== null);
        setIsCode($getNearestNodeOfType(anchorNode, CodeNode) !== null);

        const nodes = selection.getNodes();
        setIsLink(nodes.some((n) => $isLinkNode(n) || $isLinkNode(n.getParent())));
      });
    });
  }, [editor]);

  useEffect(() => {
    return editor.registerCommand(
      EDIT_LINK_COMMAND,
      (url) => {
        setLinkUrl(url);
        setShowLinkInput(true);
        setTimeout(() => linkInputRef.current?.focus(), 0);
        return true;
      },
      COMMAND_PRIORITY_LOW,
    );
  }, [editor]);

  const handleLinkButtonClick = useCallback(() => {
    if (isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
      setShowLinkInput(false);
      setLinkUrl('');
    } else {
      setShowLinkInput(true);
      setLinkUrl('');
      setTimeout(() => linkInputRef.current?.focus(), 0);
    }
  }, [editor, isLink]);

  const handleLinkSubmit = useCallback(() => {
    const trimmed = linkUrl.trim();
    const url = trimmed ? (/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`) : '';

    // Find existing link node in current selection to update it directly
    let existingLinkKey: NodeKey | null = null;
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
      const anchorNode = selection.anchor.getNode();
      if ($isLinkNode(anchorNode)) {
        existingLinkKey = anchorNode.getKey();
      } else {
        const parent = anchorNode.getParent();
        if ($isLinkNode(parent)) existingLinkKey = parent.getKey();
      }
    });

    if (existingLinkKey && url) {
      editor.update(() => {
        const node = $getNodeByKey(existingLinkKey!);
        if ($isLinkNode(node)) node.setURL(url);
      });
    } else if (existingLinkKey && !url) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    } else if (url) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
    }

    setShowLinkInput(false);
    setLinkUrl('');
  }, [editor, linkUrl]);

  const handleLinkKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleLinkSubmit();
      } else if (e.key === 'Escape') {
        setShowLinkInput(false);
        setLinkUrl('');
      }
    },
    [handleLinkSubmit],
  );

  const handleCodeBlock = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
      const anchorNode = selection.anchor.getNode();
      const codeNode = $getNearestNodeOfType(anchorNode, CodeNode);
      if (codeNode) {
        codeNode.replace(codeNode.getFirstChild() ?? $createCodeNode());
      } else {
        const node = $createCodeNode();
        selection.insertNodes([node]);
      }
    });
  }, [editor]);

  const formatButtons = [
    {
      Icon: Bold,
      title: 'Bold',
      active: isBold,
      onClick: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold'),
    },
    {
      Icon: Italic,
      title: 'Italic',
      active: isItalic,
      onClick: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic'),
    },
    {
      Icon: Underline,
      title: 'Underline',
      active: isUnderline,
      onClick: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline'),
    },
    {
      Icon: List,
      title: 'List',
      active: isList,
      onClick: () =>
        editor.dispatchCommand(
          isList ? REMOVE_LIST_COMMAND : INSERT_UNORDERED_LIST_COMMAND,
          undefined,
        ),
    },
    { Icon: Code, title: 'Code block', active: isCode, onClick: handleCodeBlock },
    { Icon: Link2, title: 'Link', active: isLink, onClick: handleLinkButtonClick },
  ];

  return (
    <div className='border-b border-outline-variant bg-surface-container-low'>
      <div className='flex items-center gap-0.5 px-3 py-2'>
        {formatButtons.map(({ Icon, title, active, onClick }) => (
          <button
            key={title}
            type='button'
            title={title}
            disabled={disabled}
            onClick={onClick}
            className={`p-1.5 rounded transition-colors disabled:opacity-50 disabled:cursor-default ${
              active
                ? 'text-primary bg-surface-container'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
            }`}>
            <Icon size={15} />
          </button>
        ))}
      </div>

      {showLinkInput && (
        <div className='flex items-center gap-1.5 px-3 pb-2'>
          <input
            ref={linkInputRef}
            type='url'
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={handleLinkKeyDown}
            placeholder='Paste or type a URL…'
            className='flex-1 px-2.5 py-1 text-body-sm text-on-surface bg-surface-container rounded-lg border border-outline-variant outline-none focus:border-primary transition-colors'
          />
          <button
            type='button'
            onClick={handleLinkSubmit}
            className='px-2.5 py-1 text-body-sm text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors'>
            Save
          </button>
          <button
            type='button'
            onClick={() => {
              setShowLinkInput(false);
              setLinkUrl('');
            }}
            className='p-1 text-on-surface-variant hover:text-on-surface transition-colors'>
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
