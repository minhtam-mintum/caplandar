import { createCommand, type LexicalCommand } from 'lexical';
import { ListNode, ListItemNode } from '@lexical/list';
import { LinkNode, AutoLinkNode } from '@lexical/link';
import { CodeNode, CodeHighlightNode } from '@lexical/code';
import styles from '../styles/richTextRhf.module.scss';

export const EDIT_LINK_COMMAND: LexicalCommand<string> = createCommand('EDIT_LINK_COMMAND');

export const EDITOR_THEME = {
  text: {
    bold: styles.textBold,
    italic: styles.textItalic,
    underline: styles.textUnderline,
    code: styles.textCode,
  },
  list: {
    ul: styles.listUl,
    ol: styles.listOl,
  },
  link: styles.link,
  code: styles.codeBlock,
};

export const EDITOR_NODES = [ListNode, ListItemNode, LinkNode, AutoLinkNode, CodeNode, CodeHighlightNode];
