import React, { useCallback, useState } from 'react';
import './AceEditor.scss';
import { getModeForPath } from './AceModelist';
import AceEditor from 'react-ace';
import "ace-builds/src-noconflict/theme-github";

ace.config.set('basePath', "https://cdn.jsdelivr.net/npm/ace-builds@1.4.3/src-noconflict");

export default function CustomAceEditor(props) {

    const [editorMode, setEditorMode] = useState("text");

    const editor = useCallback((node) => {
        if (node) {
            setEditorMode(getModeForPath(props.editedFile)["name"]);
        }
    }, [props.editedFile]);

    return (

        <AceEditor
            mode={editorMode}
            ref={editor}
            theme="github"
            name="file-editor"
            width='100%'
            height='100%'
            fontSize={14}
            value={props.value}
            editorProps={{ $blockScrolling: false }}
        />
    )
}