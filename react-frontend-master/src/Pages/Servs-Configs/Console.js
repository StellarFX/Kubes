import "./Console.scss";
import { faPowerOff, faRedoAlt, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Console(){

    return(
        <div className="console-main-container">
            <div className="console-container">

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
                        
                    </div>
                </div>
            </div>
        </div>
    );

}