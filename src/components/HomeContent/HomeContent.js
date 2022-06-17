import './HomeContent.scss'
import { useState } from 'react'
const fs = window.require('fs');
const path = window.require('path');
const HomeContent = () => {

    const [versionList, setVersionList] = useState(()=> localStorage.getItem('versions') ? JSON.parse(localStorage.getItem('versions')) : []);
    const [customVersion, setCustomVersion] = useState(()=> localStorage.getItem('cversions') ? JSON.parse(localStorage.getItem('cversions')) : {});
    const [activeVersion, setActiveVersion] = useState(()=> localStorage.getItem('active') ? localStorage.getItem('active') : ' ');

    var modsFolder = JSON.parse(localStorage.getItem('path'));
    var destFolder = path.join(String(modsFolder), '..', '/umods')

    const activateMods = (version) => {
        if (version != activeVersion){
        fs.readdir(String(modsFolder), (err, files) => {
            files.forEach(file => {
                if(!file.includes('[' + version + ']'))
                {
                    fs.rename(String(modsFolder) + '/' + file, String(destFolder) + '/' + file, function (err) {
                        if (err) {
                            throw err
                        }
                    });
                }
            });
        });
        fs.readdir(String(destFolder), (err, files) => {
            files.forEach(file => {
                if(file.includes('[' + version + ']'))
                {
                    fs.rename(String(destFolder) + '/' + file, String(modsFolder) + '/' + file, function (err) {
                        if (err) {
                            throw err
                        }
                    });
                }
            });
            //alert("Mods successfully activated");
            localStorage.setItem('active', version);
            setActiveVersion(version);
        });
        }
        //else{alert('Mods for this version are already activated')}
    }

    const activateCustomMods = (version) => {
        if (version != activeVersion){
        let getVersion = JSON.parse(localStorage.getItem('cversions'));
        let parsedFiles = getVersion[version];
            fs.readdir(String(modsFolder), (err, files) => {
                var common = files.filter(x => !parsedFiles.includes(x))
                common.forEach(cfile =>{
                    fs.rename(String(modsFolder) + '/' + cfile, String(destFolder) + '/' + cfile, function (err) {
                        if (err) {
                            throw err
                        }
                    });
                });
            });
            fs.readdir(String(destFolder), (err, files) => {
                var common = files.filter(x => parsedFiles.includes(x))
                common.forEach(cfile =>{
                    fs.rename(String(destFolder) + '/' + cfile, String(modsFolder) + '/' + cfile, function (err) {
                        if (err) {
                            throw err
                        }
                    });
                });
            });
            //alert("Mods successfully activated");
            localStorage.setItem('active', version);
            setActiveVersion(version);
        }
    }

    const disableMods = () => {
        fs.readdir(String(modsFolder), (err, files) => {
            files.forEach(file => {
                fs.rename(String(modsFolder) + '/' + file, String(destFolder) + '/' + file, function (err) {
                    if (err) {
                        throw err
                    }
                });
            });
        });
        localStorage.setItem('active', 'Without mods');
        setActiveVersion('Without mods');
    }
    return (
        <main>
            <section className='active-version'>
                <article>{activeVersion}</article>
            </section>
            <section className='main-list'>
                <section className='list-header'>
                    <article>Version</article>
                    <article style={{marginLeft: 'auto'}}>Action</article>
                </section>
                <section className='list-content'>
                    {versionList.map((version, index) => 
                    <section className='list-item' key={index}>
                        <article>{version}</article>
                        <article style={{marginLeft: 'auto'}}><button className='activate-btn' onClick={() => activateMods(version)}>Activate</button></article>
                    </section>
                    )}
                    {Object.keys(customVersion).map((version, index) =>
                        <section className='list-item' key={index}>    
                            <article>{version}</article>
                            <article style={{marginLeft: 'auto'}}><button className='activate-btn' onClick={() => activateCustomMods(version)}>Activate</button></article>
                        </section> 
                    )}
                </section>
                <section className='list-item'>
                        <article>Without mods</article>
                        <article style={{marginLeft: 'auto'}}><button className='activate-btn' onClick={disableMods}>Activate</button></article>
                    </section>
            </section>
            {/* <button onClick={() => localStorage.removeItem('path')}>Del path</button> */}
        </main>
    );
}
 
export default HomeContent;