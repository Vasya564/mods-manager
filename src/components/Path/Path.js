import { useState } from 'react';
import './Path.scss'
import { useNavigate } from 'react-router-dom';
const { ipcRenderer } = window.require("electron");
const fs = window.require('fs');
const path = window.require('path');
const Path = () => {
    const navigate = useNavigate();
    const [pathDir, setPathDir] = useState ('');

    ipcRenderer.on('path-result', (event, data)=>{
        setPathDir(data);
        localStorage.setItem('path', JSON.stringify(data))
    })

    const createFolder = () => {
        if(pathDir){
            navigate('/');
            fs.mkdir(path.join(path.resolve(String(pathDir), ".."), 'umods'),
            { recursive: true }, (err) => {
                if (err) {
                    return console.error(err);
                }
            });
        }
    }
    
    return (
       <section className="path-container">
           <section className='path-block'>
               <section>
                <article className='heading'>Mods folder path</article>
                <input type='text' readOnly value={pathDir}></input>
                <button onClick={() => ipcRenderer.invoke('path-dialog-event')}>Browse</button>
                </section>
           </section>
           <section className='path-next-btn'>
                <button onClick={createFolder}>Continue</button>
           </section>
       </section> 
    );
}
 
export default Path;