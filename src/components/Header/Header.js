import './Header.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faXmark } from '@fortawesome/free-solid-svg-icons';
const { ipcRenderer } = window.require("electron");
const Header = () => {

    const minimizeHandler = () => {
        ipcRenderer.invoke('minimize-event')
    }
    const closeHandler = () => {
        ipcRenderer.invoke('close-event')
    }

    return (
        <header>
            <section className='title'>Mods Manager</section>
            <section className='minimize-btn'><FontAwesomeIcon icon={faMinus} onClick={minimizeHandler}/></section>
            <section className='close-btn'><FontAwesomeIcon icon={faXmark} size='lg' onClick={closeHandler}/></section>
        </header>
    );
}
 
export default Header;