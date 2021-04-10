import React, { useContext, useState } from 'react';
import ReactDOM from "react-dom";
import { HashRouter, Redirect, Route, Switch, withRouter } from "react-router-dom";
import { Slide, toast, ToastContainer } from 'react-toastify';
// start the Stimulus application
import './bootstrap';
import Navbar from './js/components/Navbar';
import PrivateRoute from './js/components/PrivateRoute';
import AuthContexts from './js/contexts/AuthContexts';
import CustomerPage from './js/pages/CustomerPage';
import CustomersPage from './js/pages/CustomersPage';
import Homepage from './js/pages/Homepage';
import InvoicePage from './js/pages/InvoicePage';
import InvoicesPage from './js/pages/InvoicesPage';
import LoginPage from './js/pages/LoginPage';
import RegisterPage from './js/pages/RegisterPage';
import authAPI from './js/services/authAPI';
import 'react-toastify/dist/ReactToastify.css';

/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */
// any CSS you import will output into a single css file (app.css in this case)
import './styles/app.css';

authAPI.setup();


const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(authAPI.isAuthenticated());

    const NavbarWithRouter = withRouter(Navbar);

    const contextValue= {
        isAuthenticated: isAuthenticated,
        setIsAuthenticated: setIsAuthenticated
    }

    return (
        <AuthContexts.Provider value={contextValue}>
            <HashRouter>
                <NavbarWithRouter/>
                <main className="container pt-5">
                    <Switch>
                        <Route path="/login" component={LoginPage} />
                        <Route path="/register" component={RegisterPage} />
                        <PrivateRoute path="/invoices/:id" component={InvoicePage} />
                        <PrivateRoute path="/invoices" component={InvoicesPage} />
                        <PrivateRoute path="/customers/:id" component={CustomerPage} />
                        <PrivateRoute path="/customers" component={CustomersPage} />
                        <Route path="/" exact component={Homepage} />
                    </Switch>
                </main>
            </HashRouter>
            <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} transition={Slide} />
        </AuthContexts.Provider>
    );
};

const rootElement = document.querySelector('#app');
ReactDOM.render(<App/>, rootElement);