import './Sidebar.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faSliders, faFilePen, faGear, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import logo from '../../assets/logo.png'
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
const Sidebar = () => {

    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => setIsOpen(!isOpen);

    return (
        <aside>
            <section className='logo'>
                <img src={logo} alt='logo'></img>
            </section>
            <NavLink className={({ isActive }) => (isActive ? 'active' : 'nav-button')} to='/'>
                <article><FontAwesomeIcon icon={faHouse} size='xs' /> Home</article>
            </NavLink>
            <section className='nav-button'>
                <article onClick={handleClick}><FontAwesomeIcon icon={faSliders} size='xs' /> Versions <span id='iconSpan'></span> 
                    {isOpen
                    ? <FontAwesomeIcon icon={faChevronUp} size='xs' />
                    : <FontAwesomeIcon icon={faChevronDown} size='xs' />
                    } 
                </article>
            </section>
            {isOpen && 
                <section>
                    <NavLink className={({ isActive }) => (isActive ? 'sub-active' : 'sub-nav-button')} to='/versions/usual'>Usual</NavLink>
                    <NavLink className={({ isActive }) => (isActive ? 'sub-active' : 'sub-nav-button')} to='/versions/custom'>Custom</NavLink>
                </section>                
            }
            {/* <section className='nav-button'>
                <article><FontAwesomeIcon icon={faFilePen} size='xs' /> Manage <FontAwesomeIcon icon={faChevronDown} size='xs' /></article>
            </section> */}
            <NavLink className={({ isActive }) => (isActive ? 'active' : 'nav-button')} to='/settings'>
                <article><FontAwesomeIcon icon={faGear} size='xs' /> Settings</article>
            </NavLink>
        </aside>
    );
}
 
export default Sidebar;