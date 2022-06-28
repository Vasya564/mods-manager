import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCircleInfo, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import Modal from "react-modal"; 
const path = window.require('path');
const { ipcRenderer } = window.require("electron");
import './Custom.scss'
const Custom = () => {
    Modal.setAppElement("#root");
    const [versionName, setVersionName] = useState('');
    const [versions, setVersions] = useState(()=> localStorage.getItem('cversions') ? JSON.parse(localStorage.getItem('cversions')) : {});
    const [files, setFiles] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [modalText, setModalText] = useState('');
    const [modalIcon, setModalIcon] = useState('');
    const [isModalWarning, setIsModalWarning] = useState(false);

    ipcRenderer.on('cversions-result', (event, data)=>{
        let result = [];
        data.forEach(file => {
            result.push(path.basename(file)); 
        });
        setFiles(result);
    })
    const openModal = (text, icon) => {
        setModalText(text);
        setModalIcon(icon);
        if(icon.iconName == 'triangle-exclamation'){
            setIsModalWarning(true)
        }else{
            setIsModalWarning(false);
        };
        setIsOpen(true);
        setTimeout(closeModal, 3000);
    }
    const closeModal = () => {
        setIsOpen(false);
    }
    const addCustomVersion = () => {
        if (versionName){
            if(files != 0){
                if(!versions.hasOwnProperty(versionName)){
                    setVersions({...versions, [versionName]: files})
                    setVersionName('');
                    openModal('Version added', faCircleInfo);
                }
                else{
                    openModal('This version already exists', faTriangleExclamation);
                }
            }
        }
    }
    const handleRemove = (version) => {
        let copyOfVersions = {...versions}
        delete copyOfVersions[version]
        setVersions(copyOfVersions);
        openModal('Version deleted', faCircleInfo);
    }
    useEffect(() =>{
        localStorage.setItem('cversions', JSON.stringify(versions))
    },[versions])

    return (
        <main className="center">
            <Modal
                isOpen={isOpen}
                closeTimeoutMS={500}
                contentLabel="My dialog"
                className="modal"
                overlayClassName="modal-overlay"
                style={{content:{backgroundColor: isModalWarning ? '#B82100' : '#067242'}}}
            >
                <div><FontAwesomeIcon icon={modalIcon} size='xl'></FontAwesomeIcon><p>{modalText}</p></div>
            </Modal>
            <section className="versions-block">
                <section className="cversions-header">
                    <article className="heading">Version name</article>
                    <input onChange={(e) => setVersionName(e.target.value)} type='text' value={versionName} spellCheck="false"></input>
                    <button onClick={() => ipcRenderer.invoke('cversions-dialog-event')}>Browse</button>
                </section>
                <section className="versions-list-block">
                    <section className='cversions-list-header'>
                        <article className="heading">Version list</article>
                    </section>
                    <section className="versions-list">
                        <section className="versions-list-inner">
                            {Object.keys(versions).map((version, index) =>
                                <section className="versions-list-item" key={index}>    
                                    <article>{version}</article>
                                    <button style={{marginLeft: 'auto'}} onClick={() => handleRemove(version)}><FontAwesomeIcon icon={faXmark} size='lg'></FontAwesomeIcon></button>
                                </section> 
                            )}
                        </section>
                    </section>
                    <button className='addc-btn' onClick={addCustomVersion}>Add version</button>
                </section>
            </section>
        </main>
    );
}
 
export default Custom;