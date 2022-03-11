import React from 'react';
import "./Console.scss";
import { faPowerOff, faRedoAlt, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Terminal from '/components/Terminal/terminal';

export default function Console(){

    return(
        <div className="console-main-container">
            <div className="console-container">
                <Terminal/>
            </div>

            <div className="console-bottom">
                <div className="console-actions">
                    <p className="console-bottom-title">Actions</p>
                    <div className="actions-container">
                        <div className="start-server">
                            <p><FontAwesomeIcon icon={faPowerOff}/>Start</p>
                        </div>
                        <div className="restart-server">
                            <p><FontAwesomeIcon icon={faRedoAlt}/>Restart</p>
                        </div>
                        <div className="stop-server">
                            <p><FontAwesomeIcon icon={faTimes}/>Stop</p>
                        </div>
                    </div>
                </div>
                <div className="console-properties">
                    <p className="console-bottom-title">Properties</p>
                    <div className="properties-container">
                        <div className="p-left">
                            <p>Users online:</p>
                            <p>Version:</p>
                            <p>Port:</p>
                        </div>
                        <div className="p-right">
                            <p>0/50</p>
                            <p>Spigot 1.12.2</p>
                            <p>25250</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}