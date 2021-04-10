import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Field from "../components/forms/Field";
import Select from "../components/forms/Select";
import FormContentLoader from "../components/loaders/FormContentLoader";
import customersAPI from "../services/customersAPI";
import invoicesAPI from "../services/invoicesAPI";

const InvoicePage = ({history, match}) => {

    const {id = "new"} = match.params;

    const [invoice, setInvoice] = useState({
        amount: '',
        customer: "",
        status: "SENT"
    });

    const [error, setError] = useState({
        amount: '',
        customer: "",
        status: ""
    });

    const [customers, setCustomers] = useState([]);

    const [editing, setEditing] = useState(false);

    const [loading, setLoading] = useState(true);

    //recuperation des customers
    const fetchCustomers = async () => {
        try {
            const data = await customersAPI.findAll();
            setCustomers(data);
            setLoading(false);
            //if(!invoice.customer) setInvoice({...invoice, customer: data[0].id});
        } catch(error) {
            console.log(error.response);
            toast.error("échec lors de la récuperation des clients")
            history.replace('/invoices');
        }
    }
    
    //recuperation d'une facture
    const fetchInvoice = async id => {
        try {
            const {amount, status, customer} = await invoicesAPI.find(id);
            setInvoice({amount, status, customer: customer.id});
            setLoading(false);
        } catch(error) {
            console.log(error.response);
            toast.error("erreur lors de la récuperation de votre facture");
            history.replace("/invoices");
        }
    }

    //recuperation liste client au chargement du composant
     useEffect(() => {
        fetchCustomers()
    }, [])  


    //recuperation de la facture quand l'id change
    useEffect(() => {
        if(id !== "new") {
            setEditing(true);
            fetchInvoice(id);
        } 
    }, [id])

    //changement des inputs du form
    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget;
        setInvoice({...invoice, [name]: value});
    }

    //gestion soumission form
    const handleSubmit = async event => {
        event.preventDefault();
        try{
            if(editing){
                await invoicesAPI.update(id, invoice);
                toast.success("Facture mise à jour")
            } else {
                await invoicesAPI.create(invoice);
                toast.success("La facture est enregistrée")
            }
            history.replace('/invoices');
        } catch(error){
            if(error.response.data.violations){
                const apiErrors = {};
                error.response.data.violations.forEach(violation => {
                    apiErrors[violation.propertyPath] = violation.message;
                });
                setError(apiErrors);
                toast.error("echec");
            }
        }
    };

    return (
        <>
            {editing && <h1>modification d'une facture</h1> || <h1>Création d'une facture</h1>}
            {!loading && (
            <form onSubmit={handleSubmit}>
                <Field 
                    name="amount"
                    type="number"
                    placeholder="Montant de la facture"
                    label="Montant"
                    onChange={handleChange}
                    value={invoice.amount}
                    error={error.amount}
                />
                <Select 
                    name="customer"
                    label="client"
                    value={invoice.customer}
                    error={error.customer}
                    onChange={handleChange}
                >
                    {customers.map(customer => <option key={customer.id} value={customer.id}>{customer.firstName} {customer.lastName}</option>)}
                </Select>
                <Select
                    name="status"
                    label="Statut"
                    value={invoice.status}
                    error={error.status}
                    onChange={handleChange}
                >
                    <option value="SENT">Envoyée</option>
                    <option value="PAID">Payée</option>
                    <option value="CANCELLED">Annulée</option>
                </Select>
                <div className="form-group">
                    <button type="submit" className="btn btn-success">Enregistrer</button>
                    <Link to="/invoices" className="btn btn-info ml-2">Retour à la liste des factures</Link>
                </div>
            </form>
            )}
            {loading && <FormContentLoader />}
        </>
    );
};

export default InvoicePage;
