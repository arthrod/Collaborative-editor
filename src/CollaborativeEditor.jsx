import React, { useState, useEffect, useCallback } from 'react';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';
import ContentEditable from 'react-contenteditable';
import diff from 'fast-diff';
const CollaborativeEditor = () => {
  const [ydoc] = useState(new Y.Doc());
  const [provider, setProvider] = useState(null);
  const [content, setContent] = useState('');
  const [yText] = useState(ydoc.getText('shared-text'));

  // Set up WebSocket connection and synchronization
  useEffect(() => {
    const wsProvider = new WebsocketProvider(
      'ws://172.16.202.197:1234', // Yjs WebSocket server
      'my-roomname',
      ydoc
    );
   
    setProvider(wsProvider);
    wsProvider.on('status', event => {
        console.log(event.status) // logs "connected" or "disconnected"
      })
    return () => {
      wsProvider.destroy();
      ydoc.destroy();
    };
  }, [ydoc]);

  // Observe changes from Yjs
  useEffect(() => {
    const observer = () => {
      setContent(yText.toString());
    };
    
    yText.observe(observer);
    return () => yText.unobserve(observer);
  }, [yText]);

  // Handle local edits
  const handleChange = useCallback((event) => {
    const newValue = event.target.value;
    const oldValue = yText.toString();
    const diffs = diff(oldValue, newValue);
  
    let index = 0;
    ydoc.transact(() => {
      diffs.forEach(([type, text]) => {
        if (type === diff.EQUAL) {
          index += text.length;
        } else if (type === diff.DELETE) {
          yText.delete(index, text.length);
        } else if (type === diff.INSERT) {
          console.log(text,"ttttttttttttt")
          yText.insert(index, text);
          index += text.length;
        }
      });
    });
  }, [yText, ydoc]);

  return (
    <div className="editor">
      <ContentEditable
        html={content}
        onChange={handleChange}
        tagName="div"
        style={{
          border: '1px solid #ccc',
          padding: '1rem',
          minHeight: '200px'
        }}
      />
      <div className="status">
        Connected users: {provider?.awareness?.getStates().size}
      </div>
    </div>
  );
};

export default CollaborativeEditor;