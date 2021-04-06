import React from 'react';
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch } from "react-router-dom";
// start the Stimulus application
import './bootstrap';
import Navbar from './js/components/Navbar';
import CustomersPage from './js/pages/CustomersPage';
import Homepage from './js/pages/Homepage';
import InvoicesPage from './js/pages/InvoicesPage';
/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */
// any CSS you import will output into a single css file (app.css in this case)
import './styles/app.css';




console.log('hello worl')

const App = () => {
    return <>
        <HashRouter>
            <Navbar />
            <main className="container pt-5">
                <Switch>
                    <Route path="/invoices" component={InvoicesPage} />
                    <Route path="/customers" component={CustomersPage} />
                    <Route path="/" exact component={Homepage} />
                </Switch>
            </main>
        </HashRouter>
    </>
};

const rootElement = document.querySelector('#app');
ReactDOM.render(<App/>, rootElement);