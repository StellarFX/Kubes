import React, { useCallback, useState } from 'react';
import './AceEditor.scss';
import { getModeForPath } from './AceModelist';
import AceEditor from 'react-ace';
import ace from 'ace-builds';
import "ace-builds/src-noconflict/theme-github";

ace.config.set('basePath', "https://cdn.jsdelivr.net/npm/ace-builds@1.4.3/src-noconflict");

export default function CustomAceEditor(props) {

    const [editorMode, setEditorMode] = useState("text");
    const [aceNode, setAceNode] = useState(null);

    const editor = useCallback((node) => {
        if (node) {
            setAceNode(node);
            setEditorMode(getModeForPath(props.editedFile['Editedname'] + "." + props.editedFile['Editedtype'])["name"]);
        }
    }, [props.editedFile]);


    function saveFile() {
        props.change(aceNode.editor.getValue());
    }

    return (

        <AceEditor
            mode={editorMode}
            ref={editor}
            theme="github"
            onBlur={() => saveFile()}
            name="file-editor"
            width={props.setWidth}
            height={props.setHeight}
            fontSize={14}
            value={props.value}
            editorProps={{ $blockScrolling: false }}
        />
    )
}