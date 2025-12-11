import React, { useRef, useEffect } from 'react';
import { Box } from '@mui/material';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { html } from '@codemirror/lang-html';
import { json } from '@codemirror/lang-json';
import { oneDark } from '@codemirror/theme-one-dark';
import { glassTokens } from '@theme/theme';

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: string;
  readOnly?: boolean;
  height?: string | number;
}

/**
 * Componente de editor de código VSCode-like com CodeMirror
 * Usa CodeMirror em vez de Monaco para evitar problemas de CSP
 */
export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = 'javascript',
  readOnly = false,
  height = '100%',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<EditorView | null>(null);

  const getLanguageExtension = (lang: string) => {
    switch (lang) {
      case 'javascript':
      case 'js':
      case 'typescript':
      case 'ts':
        return javascript({ typescript: true });
      case 'python':
      case 'py':
        return python();
      case 'html':
      case 'htm':
        return html();
      case 'json':
        return json();
      default:
        return javascript();
    }
  };

  useEffect(() => {
    if (!containerRef.current || editorRef.current) return;

    const state = EditorState.create({
      doc: value,
      extensions: [
        basicSetup,
        getLanguageExtension(language),
        oneDark,
        EditorView.editable.of(!readOnly),
        EditorView.updateListener.of((update) => {
          if (update.docChanged && onChange) {
            onChange(update.state.doc.toString());
          }
        }),
        EditorView.theme(
          {
            '.cm-editor': {
              fontFamily: "'Fira Code', 'Monaco', 'Menlo', monospace",
              fontSize: '13px',
              height: '100%',
            },
            '.cm-gutters': {
              backgroundColor: '#1e1e1e',
              borderRight: '1px solid #333',
            },
            '.cm-activeLineGutter': {
              backgroundColor: '#2d2d2d',
            },
          },
          { dark: true }
        ),
      ],
    });

    editorRef.current = new EditorView({
      state,
      parent: containerRef.current,
    });

    return () => {
      editorRef.current?.destroy();
      editorRef.current = null;
    };
  }, [value, language, readOnly, onChange]);

  useEffect(() => {
    if (editorRef.current && editorRef.current.state.doc.toString() !== value) {
      editorRef.current.dispatch({
        changes: {
          from: 0,
          to: editorRef.current.state.doc.length,
          insert: value,
        },
      });
    }
  }, [value]);

  return (
    <Box
      sx={{
        height,
        width: '100%',
        borderRadius: glassTokens.glass.borderRadius,
        overflow: 'hidden',
        border: glassTokens.glass.border,
        backgroundColor: '#1e1e1e',
        '& .cm-editor': {
          height: '100%',
        },
      }}
      ref={containerRef}
    />
  );
};
