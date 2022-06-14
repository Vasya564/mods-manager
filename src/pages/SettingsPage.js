import Settings from "../components/Settings/Settings";
import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";
const SettingsPage = () => {
    return (
        <main className="main-grid">
            <Header />
            <Settings />
            <Sidebar />
        </main>
    );
}
 
export default SettingsPage;