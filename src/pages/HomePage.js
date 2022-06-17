import Header from "../components/Header/Header";
import HomeContent from "../components/HomeContent/HomeContent";
import Sidebar from "../components/Sidebar/Sidebar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const HomePage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        let path = localStorage.getItem('path');
        if(!path){
            navigate('/path');
        }
    })
    return ( 
        <main className="main-grid">
            <Header />
            <HomeContent />
            <Sidebar />
        </main>
    );
}
 
export default HomePage;