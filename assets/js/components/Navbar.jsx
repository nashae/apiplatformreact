import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import AuthContexts from "../contexts/AuthContexts";
import authAPI from "../services/authAPI";

const Navbar = ({history}) => {

    const  {isAuthenticated, setIsAuthenticated} = useContext(AuthContexts)

    const handleLogout = () => {
        authAPI.logout();
        setIsAuthenticated(false);
        toast.info('à bientôt !!')
        history.replace("/login");

    }

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <NavLink className="navbar-brand" to="/">
                    apiplatformreact
                </NavLink>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarColor01"
                    aria-controls="navbarColor01"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarColor01">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/customers">
                                Clients
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/invoices">
                                Factures
                            </NavLink>
                        </li>
                    </ul>
                    <ul className="navbar-nav ml-auto">
                    {!isAuthenticated && (
                            <>
                            <li className="nav-item">
                                <NavLink to="/register" className="btn btn-info">
                                    Inscription
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/login" className="btn btn-success">
                                    Connexion
                                </NavLink>
                            </li>
                            </>
                    ) || (
                        <li className="nav-item">
                            <button onClick={handleLogout} className="btn btn-warning">
                                Déconnexion
                            </button>
                        </li>

                    )}
                    </ul>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
