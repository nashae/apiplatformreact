import React, { useContext, useState } from "react";
import AuthContexts from "../contexts/AuthContexts";
import AuthAPI from "../services/authAPI";

const LoginPage = ({history}) => {
    const {setIsAuthenticated} = useContext(AuthContexts);
    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
    });
    const [error, setError] = useState('');

    //gestion des champs
    const handleChange = ({currentTarget}) => {
        const {value, name} = currentTarget;
        setCredentials({...credentials, [name]: value});
    }
    /* const handleChange = (event) => {
        const value = event.currentTarget.value;
        const name = event.currentTarget.name;
        setCredentials({...credentials, [name]: value})
    } */

    //gestion du submit
    const handleSubmit = async event => {
        event.preventDefault();
        try {
            await AuthAPI.authenticate(credentials);
            setError('');
            setIsAuthenticated(true);
            history.replace("/customers");
        } catch (error){
            console.log(error.response);
            setError('informations incorrectes')
        }
    }

    return (
        <>
            <h1>Connexion à l'application</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Adresse email</label>
                    <input
                        type="email"
                        className= {"form-control " + (error && 'is-invalid')}
                        placeholder="Adresse email de connexion"
                        name="username"
                        id="username"
                        value={credentials.username}
                        onChange={handleChange}
                    />
                    {error && <p className="invalid-feedback">{error}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="password">Mot de passe</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="mot de passe associé"
                        name="password"
                        id="password"
                        value={credentials.password}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-success">
                        Je me connecte
                    </button>
                </div>
            </form>
        </>
    );
};

export default LoginPage;
