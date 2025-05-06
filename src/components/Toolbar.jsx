import React from 'react';
import {
  Toolbar,
  BoldButton,
  ItalicButton,
  useEventEditorId,
  getSlatePluginType,
} from '@udecode/plate';

export default function CustomToolbar() {
  const editor = useEventEditorId('focus');

  return (
    <Toolbar>
      <BoldButton
        type={getSlatePluginType(editor, 'bold')}
        icon={'B'}
      />
      <ItalicButton
        type={getSlatePluginType(editor, 'italic')}
        icon={'I'}
      />
    </Toolbar>
  );
}