import React, { useEffect, useMemo } from 'react';
import { createEditor } from 'slate';
import { Plate, withPlate } from '@udecode/plate';
import { withYjs, YjsEditor } from '@slate-yjs/core';
import { useRemoteCursors } from '@slate-yjs/react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { WS_URL, ROOM_NAME } from '../constants';
import Toolbar from './Toolbar';

const initialValue = [
  { type: 'p', children: [{ text: 'Start collaborating!' }] },
];

// Define your plugins array outside the component
const plugins = [
  // Add your Plate plugins here
];

export default function CollabEditor() {
  // 1. Set up Yjs document and provider
  const [ydoc, provider] = useMemo(() => {
    const doc = new Y.Doc();
    const provider = new WebsocketProvider(WS_URL, ROOM_NAME, doc);
    return [doc, provider];
  }, []);

  // 2. Create Yjs-aware editor
  const editor = useMemo(() => {
    const slateEditor = withPlate(
      withYjs(createEditor(), ydoc.get('content', Y.XmlText)),
      {
        id: 'collab-editor',
        plugins,
        options: {
          // Add any editor options here
        }
      }
    );
    return slateEditor;
  }, [ydoc]);

  // 3. Connect editor to Yjs
  useEffect(() => {
    YjsEditor.connect(editor);
    return () => YjsEditor.disconnect(editor);
  }, [editor]);

  // 4. Set up cursor decorations
  const { decorate } = useRemoteCursors(editor, {
    renderCursor: (cursor) => (
      <span
        style={{
          background: cursor.state.color,
          padding: '2px 0',
          position: 'relative',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: '-20px',
            fontSize: '12px',
            background: cursor.state.color,
            padding: '2px 5px',
            borderRadius: '3px',
          }}
        >
          {cursor.state.name}
        </span>
        {cursor.children}
      </span>
    ),
  });

  // 5. Set user presence
  useEffect(() => {
    provider.awareness.setLocalState({
      name: `User-${Math.floor(Math.random() * 1000)}`,
      color: `hsl(${Math.random() * 360}deg 80% 60%)`,
    });
  }, [provider]);

  return (
    <div className="editor-container">
      <Plate
        editor={editor}
        initialValue={initialValue}
      >
        <Toolbar />
        <Plate.Content
          decorate={decorate}
          style={{ 
            padding: '20px',
            border: '1px solid #ccc',
            minHeight: '300px',
            marginTop: '10px'
          }}
        />
      </Plate>
    </div>
  );
}