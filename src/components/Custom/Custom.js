import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
const path = window.require('path');
const { ipcRenderer } = window.require("electron");
import './Custom.scss'
const Custom = () => {

    const [versionName, setVersionName] = useState('');
    const [versions, setVersions] = useState(()=> localStorage.getItem('cversions') ? JSON.parse(localStorage.getItem('cversions')) : {});
    const [files, setFiles] = useState([]);

    ipcRenderer.on('cversions-result', (event, data)=>{
        let result = [];
        data.forEach(file => {
            result.push(path.basename(file)); 
        });
        setFiles(result);
    })

    const addCustomVersion = () => {
        if (versionName){
            if(files != 0){
                setVersions({...versions, [versionName]: files})
            }
        }
    }
    const handleRemove = (version) => {
        let copyOfVersions = {...versions}
        delete copyOfVersions[version]
        setVersions(copyOfVersions)
    }
    useEffect(() =>{
        localStorage.setItem('cversions', JSON.stringify(versions))
    },[versions])

    return (
        <main className="center">
            <section className="uversions-block">
                <section className="cversions-header">
                    <article className="heading">Version name</article>
                    <input onChange={(e) => setVersionName(e.target.value)} type='text'></input>
                </section>
                <section className="cversions-list">
                    <section className='cversions-list-header'>
                        <article className="heading">Version list</article>
                        <article className='browse-btn'><button onClick={() => ipcRenderer.invoke('cversions-dialog-event')}>Browse</button></article>
                    </section>
                    <section className="cversions-list-inner">
                        {Object.keys(versions).map((version, index) =>
                            <section className="uversions-list-item" key={index}>    
                                <article>{version}</article>
                                <button style={{marginLeft: 'auto'}} onClick={() => handleRemove(version)}><FontAwesomeIcon icon={faXmark} size='lg'></FontAwesomeIcon></button>
                            </section> 
                        )}
                    </section>
                    <article className='btn-block'><button className='addc-btn' onClick={addCustomVersion}>Add version</button></article>
                </section>
            </section>
        </main>
    );
}
 
export default Custom;