import React, { useContext } from 'react'
import {
    Link,    //Here it is used instead of <Link></Link> tag in html and instead of href to is used
    useLocation
} from "react-router-dom";
import noteContext from "../context/notes/noteContext"


const Navbar = () => {
    const context = useContext(noteContext);
    const { user } = context;

    let location = useLocation(); // Gives information abot the current location

    const handlelogout = () => {
        localStorage.removeItem('token');
    }
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">iNotebook</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === "/" ? "active" : ""}`} aria-current="page" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === "/about" ? "active" : ""}`} to="/about">About</Link>
                        </li>

                    </ul>
                    <form className="d-flex">
                        {!localStorage.getItem('token') ? <div>
                            <Link className="btn btn-primary mx-1" to="/login" role="button">Login</Link>
                            <Link className="btn btn-primary mx-1" to="/signup" role="button">Signup</Link>
                        </div> : <div className='d-flex'> <div style={{ color: "white", flexDirection: "row", alignItems: "center" }} className="d-flex"><p style={{ margin: "auto" }} className="mx-4">{user.name}</p></div><button onClick={handlelogout} className='btn btn-primary' >Logout</button></div>}

                    </form>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
