import Header from "../components/Header/Header";
import HomeContent from "../components/HomeContent/HomeContent";
import Sidebar from "../components/Sidebar/Sidebar";
import Path from "../components/Path/Path";
import { useState, useEffect } from "react";
const HomePage = () => {

    const [pathStatus, setPathStatus] = useState(null);

    useEffect(() => {
        let path = localStorage.getItem('path');
        setPathStatus(path);
    })
    const pathCheck = (status) =>{
        setPathStatus(status);
    }

    return ( 
        // <main className="main-grid">
        //     <Header />
        //     <HomeContent />
        //     <Sidebar />
        //     {pathStatus ? null : <Path pathCheck={pathCheck} />}
        // </main>
        <section className="home">
            {pathStatus 
             ? <main className="main-grid">
                    <Header />
                    <HomeContent />
                    <Sidebar />
                </main>
             : <main className="main-grid">
                    <Header />
                    <Path pathCheck={pathCheck} /> 
                </main>
            }
        </section>
    );
}
 
export default HomePage;