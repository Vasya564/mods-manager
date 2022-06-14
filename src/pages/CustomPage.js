import Custom from "../components/Custom/Custom";
import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";
const CustomPage = () => {
    return (
        <main className="main-grid">
            <Header />
            <Custom />
            <Sidebar />
        </main>
    );
}
 
export default CustomPage;