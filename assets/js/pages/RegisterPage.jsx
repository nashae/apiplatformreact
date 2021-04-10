import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Field from "../components/forms/Field";
import usersAPI from "../services/usersAPI";

const RegisterPage = ({history}) => {

    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    const [ errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    //gestion des changements d'input du form
    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget;
        setUser({...user, [name]: value});
    }

    //gestion de la soumission
    const handleSubmit = async event => {
        event.preventDefault();

        const apiErrors = {};
        if(user.password !== user.passwordConfirm){
            apiErrors.passwordConfirm = "Les mots de passe ne sont pas identiques";
            setErrors(apiErrors);
            return;
        }

        try{
            await usersAPI.register(user);
            //TODO flash
            setErrors({})
            history.replace('/login')
        }catch(error){
            console.log(error.response);
            const {violations} = error.response.data;
            if(violations){
                violations.map(violation => {
                    apiErrors[violation.propertyPath] = violation.message
                });
                setErrors(apiErrors);
            }
        }
        console.log(user);
    }

    return (
        <>
            <h1>Inscription</h1>
            <form onSubmit={handleSubmit}>
                <Field 
                    name="firstName"
                    label="Prénom"
                    placeholder="Votre prénom"
                    error={errors.firstName}
                    value={user.firstName}
                    onChange={handleChange}
                />
                <Field 
                    name="lastName"
                    label="Nom de famille"
                    placeholder="Votre nom de famille"
                    error={errors.lastName}
                    value={user.lastName}
                    onChange={handleChange}
                />
                <Field 
                    name="email"
                    label="Adresse email"
                    placeholder="Votre adresse email"
                    error={errors.email}
                    value={user.email}
                    onChange={handleChange}
                    type="email"
                />
                <Field 
                    name="password"
                    label="Mot de passe"
                    placeholder="Votre mot de passe"
                    error={errors.password}
                    value={user.password}
                    onChange={handleChange}
                    type="password"
                />
                <Field 
                    name="passwordConfirm"
                    label="Confirmation de mot de passe"
                    placeholder="Confirmez votre mot de passe"
                    error={errors.passwordConfirm}
                    value={user.passwordConfirm}
                    onChange={handleChange}
                    type="password"
                />
                <div className="form-group">
                    <button type="submit" className="btn btn-success">Je m'inscris</button>
                    <Link to="/login" className="btn btn-info ml-2">J'ai déjà un comte</Link>
                </div>
            </form>
        </>
    );
};

export default RegisterPage;
