import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import './Usual.scss'
const Usual = () => {
    const [versionInput, setVersionInput] = useState('');
    const validVersion = new RegExp('^1\.[0-9]{1,2}\.[0-9]{1,2}|1\.[0-9]{1,2}')
    const [usualVersions, setUsualVersions] = useState(()=> localStorage.getItem('versions') ? JSON.parse(localStorage.getItem('versions')) : []);

    useEffect(() =>{
        localStorage.setItem('versions', JSON.stringify(usualVersions))
    },[usualVersions])

    const handleRemoveVersion = (index) => {
        const temp = [...usualVersions];
        temp.splice(index, 1);
        setUsualVersions(temp);
    }
    const handleAddVersion = () => {
        if(versionInput.length !=0){
            if (validVersion.test(versionInput)){
                if(!usualVersions.includes(versionInput)){
                    setUsualVersions(oldArray => [...oldArray, versionInput])
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
            <section className="uversions-block">
                <section className="uversions-header">
                    <article className="heading">Version number</article>
                    <input onChange={(e) => setVersionInput(e.target.value)} name="version" type='text'></input>
                    <button onClick={handleAddVersion}><FontAwesomeIcon icon={faPlus} size='lg'></FontAwesomeIcon></button>
                </section>
                <section className="uversions-list">
                    <article className="heading">Version list</article>
                    <section className="uversions-list-inner">
                        {usualVersions.map((version, index) =>
                            <section className="uversions-list-item" key={index}>    
                                <article>{version}</article>
                                <button style={{marginLeft: 'auto'}} onClick={() => handleRemoveVersion(index)}><FontAwesomeIcon icon={faXmark} size='lg'></FontAwesomeIcon></button>
                            </section> 
                        )}
                    </section>
                </section>
            </section>
        </main>
    );
}
 
export default Usual;