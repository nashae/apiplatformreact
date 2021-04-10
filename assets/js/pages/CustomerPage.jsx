import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Field from '../components/forms/Field';
import FormContentLoader from '../components/loaders/FormContentLoader';
import customersAPI from '../services/customersAPI';

const CustomerPage = ({match, history}) => {

    const {id = "new"} = match.params;

    const [customer, setCustomer] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
    })

    const [error, setError] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
    })

    const [editing, setEditing] = useState(false);

    const [loading, setLoading] = useState(false);

    //recuperation du customer en fonction de l'id
    const fetchCustomer = async id => {
        try {
            const { firstName, lastName, email, company } = await customersAPI.find(id);
            setCustomer({firstName, lastName, email, company});
            setLoading(false);
        } catch(error) {
            console.log(error.response);
            toast.error("le client n'a pas pu être chargé");
            history.replace("/customers");
        }
    }

    //chargemet du customer si present au charement ou en cas de modif d'id
    useEffect(() => {
        if(id !== "new"){ 
            setLoading(true);
            setEditing(true);
            fetchCustomer(id);
        }
    },[id])

    //changement des inputs du form
    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget;
        setCustomer({...customer, [name]: value});
    }

    //soumission du form
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if(editing) {
                const response = await customersAPI.update(id, customer);
                toast.success("le client à été modifié");
            } else {
                const response = await customersAPI.create(customer);
                toast.success("le client a été crée");
            }
            setError({});
            history.replace("/customers");
        } catch(error){
            if(error.response.data.violations){
                const apiErrors = {};
                error.response.data.violations.forEach(violation => {
                    apiErrors[violation.propertyPath] = violation.message;
                });
                setError(apiErrors);
                toast.error("échec")
            }
        }
        
    }

    return ( <>
    {!editing && <h1>Création d'un client</h1> || <h1>Modification d'un client</h1>}
    {!loading && (
    <form onSubmit={handleSubmit}>
        <Field 
            name="lastName"
            label="Nom de famille"
            placeholder="Nom de famille du client"
            value={customer.lastName}
            onChange={handleChange}
            error={error.lastName}
        />
        <Field 
            name="firstName"
            label="Prénom"
            placeholder="Prénom du client"
            value={customer.firstName}
            onChange={handleChange}
            error={error.firstName}
        />
        <Field 
            name="email"
            label="Email"
            placeholder="Email du client"
            type="email"
            value={customer.email}
            onChange={handleChange}
            error={error.email}
        />
        <Field 
            name="company"
            label="Entreprise"
            placeholder="Entreprise du client"
            value={customer.company}
            onChange={handleChange}
            error={error.company}
        />
        <div className="form-group">
            <button type="submit" className="btn btn-success">Enregistrer</button>
            <Link to="/customers" className="btn btn-info ml-2">Retour à la liste</Link>
        </div>
    </form>
    )}
    {loading && <FormContentLoader />}
    </> );
}
 
export default CustomerPage;