import { Outlet, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { React, useState} from "react";
import { faUser, faListAlt } from '@fortawesome/free-regular-svg-icons';
import { faBars } from "@fortawesome/free-solid-svg-icons/faBars";
import { faClose } from "@fortawesome/free-solid-svg-icons";







const Layout = () => {
    const [open, setOpen] = useState(false);
    const [toggleIcon, setToggleIcon] = useState(<FontAwesomeIcon  icon={faBars}></FontAwesomeIcon>)
    const [dropClass, setDropClass] = useState("dropdown_menu")

    function openF(){
        if(open){
            setOpen(false)
            setDropClass("dropdown_menu")
            setToggleIcon(<FontAwesomeIcon  icon={faBars}></FontAwesomeIcon>)

        }else{
            setOpen(true)
            setDropClass("dropdown_menu_open")
            setToggleIcon(<FontAwesomeIcon  icon={faClose}></FontAwesomeIcon>)

        }
        
        
        
    }
  return (
    <>   
        <header>
            <div className="navbar">
                <div className="logo"><a href="#">Web Dev Creative</a></div>
                <ul className="links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/diagrams">BDD</Link></li>
                    <li><Link to="/sqlscripts">SqlScripts</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                </ul>
                <a href="#" className="action_btn">GetStarted</a>
                <div className="toggle_btn" onClick={openF}>
                    <i>{toggleIcon}</i>
                </div>
            </div>
            <div className={dropClass}>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/diagrams">BDD</Link></li>
                <li><Link to="/sqlscripts">SqlScripts</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><a href="#" className="action_btn">GetStarted</a></li>
            </div>
        </header>
        
        <div className="container-md main_content">
            <Outlet/>
        </div>
        
    </>
  )
};

export default Layout;