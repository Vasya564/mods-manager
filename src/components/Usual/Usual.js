import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark, faCircleInfo, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import Modal from "react-modal"; 
import './Usual.scss'
const Usual = () => {
    Modal.setAppElement("#root");
    const [versionInput, setVersionInput] = useState('');
    const validVersion = new RegExp('^1\.[0-9]{1,2}\.[0-9]{1,2}|1\.[0-9]{1,2}')
    const [usualVersions, setUsualVersions] = useState(()=> localStorage.getItem('versions') ? JSON.parse(localStorage.getItem('versions')) : []);
    const [isOpen, setIsOpen] = useState(false);
    const [modalText, setModalText] = useState('');
    const [modalIcon, setModalIcon] = useState('');
    const [isModalWarning, setIsModalWarning] = useState(false);

    useEffect(() =>{
        localStorage.setItem('versions', JSON.stringify(usualVersions))
    },[usualVersions])

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
    const handleRemoveVersion = (index) => {
        const temp = [...usualVersions];
        temp.splice(index, 1);
        setUsualVersions(temp);
        openModal('Version deleted', faCircleInfo);
    }
    const handleAddVersion = () => {
        if(versionInput.length !=0){
            if (validVersion.test(versionInput)){
                if(!usualVersions.includes(versionInput)){
                    setUsualVersions(oldArray => [...oldArray, versionInput])
                    setVersionInput('');
                    openModal('Version added', faCircleInfo);
                }
                else{
                    openModal('This version already exists', faTriangleExclamation);
                }
            }
            else{
                console.log('Invalid version format regex');
            }   
        }
        else{
            console.log('Invalid version format');
        }
    }

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
                <section className="uversions-header">
                    <article className="heading">Version number</article>
                    <input onChange={(e) => setVersionInput(e.target.value)} 
                        name="version" 
                        type='text' 
                        pattern="^1\.[0-9]{1,2}\.[0-9]{1,2}|1\.[0-9]{1,2}" 
                        value={versionInput}>
                    </input>
                    <button onClick={handleAddVersion}><FontAwesomeIcon icon={faPlus} size='lg'></FontAwesomeIcon></button>
                </section>
                <section className="versions-list-block">
                    <article className="heading">Version list</article>
                    <section className="versions-list">
                        <section className="versions-list-inner">
                        {usualVersions.map((version, index) =>
                            <section className="versions-list-item" key={index}>    
                                <article>{version}</article>
                                <button style={{marginLeft: 'auto'}} onClick={() => handleRemoveVersion(index)}><FontAwesomeIcon icon={faXmark} size='lg'></FontAwesomeIcon></button>
                            </section> 
                        )}
                        </section>
                    </section>
                </section>
            </section>
        </main>
    );
}
 
export default Usual;