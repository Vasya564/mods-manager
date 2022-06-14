import packageJson from '../../../package.json';
const Settings = () => {
    return (
       <main>
           version {packageJson.version}
       </main> 
    );
}
 
export default Settings;