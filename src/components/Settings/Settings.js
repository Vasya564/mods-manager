import packageJson from '../../../package.json';
import "./Settings.scss"
const Settings = () => {
    return (
       <main>
            <section className='settings-block'>
                <p>Version: {packageJson.version}</p>
            </section>
       </main> 
    );
}
 
export default Settings;