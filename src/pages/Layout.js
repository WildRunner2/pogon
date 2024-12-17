import { Outlet, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { React, useState, useEffect} from "react";
import { faBars } from "@fortawesome/free-solid-svg-icons/faBars";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import useWindowDimensions from '../hooks/windowDimension';   



const Layout = () => {
    const [open, setOpen] = useState(false);
    const [toggleIcon, setToggleIcon] = useState(<FontAwesomeIcon  icon={faBars}></FontAwesomeIcon>)
    const [dropClass, setDropClass] = useState("dropdown_menu")
    const { width } = useWindowDimensions();
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
    if(width > 992 && open){
        setOpen(false)
        setDropClass("dropdown_menu")
        setToggleIcon(<FontAwesomeIcon  icon={faBars}></FontAwesomeIcon>)
    }

    useEffect(() => {
        
    },[width])
     
  return (
    <>   
        <header>
            <div className="navbar">
                <div className="logo"><Link to="/">JB</Link></div>
                <ul className="links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/diagrams">BDD</Link></li>
                    <li><Link to="/sqlscripts">SqlScripts</Link></li>
                    <li><Link to="/3dprints">3d</Link></li>                 
                    <li><Link to="/contact">Contact</Link></li>                    
                </ul>
                <Link className="action_btn" to="/users">Login</Link>
                <div className="toggle_btn" onClick={openF}>
                    <i>{toggleIcon}</i>
                </div>
            </div>
            <div className={dropClass}>
                <li><Link onClick={openF} to="/">Home</Link></li>
                <li><Link onClick={openF} to="/diagrams">BDD</Link></li>
                <li><Link onClick={openF} to="/sqlscripts">SqlScripts</Link></li>
                <li><Link onClick={openF} to="/3dprints">3d</Link></li>                 
                <li><Link onClick={openF} to="/contact">Contact</Link></li>   
                <li><Link onClick={openF} className="action_btn_open" to="/users">Login</Link></li>
            </div>
        </header>
        
        <div className="container-md main_content">
            <Outlet/>
        </div>
        
    </>
  )
};

export default Layout;