import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import Field from "../components/forms/Field";
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
            toast.success("Vous êtes connecté")
            history.replace("/customers");
        } catch (error){
            console.log(error.response);
            setError('informations incorrectes')
            toast.error("une erreur est survenue");
        }
    }

    return (
        <>
            <h1>Connexion à l'application</h1>
            <form onSubmit={handleSubmit}>
                <Field 
                    name="username"
                    type="email"
                    label="Adresse email"
                    placeholder="Adresse email de connexion"
                    value={credentials.username}
                    error={error}
                    onChange={handleChange}
                />
                <Field 
                    name="password"
                    type="password"
                    label="Mot de passe"
                    value={credentials.password}
                    onChange={handleChange}
                />
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
