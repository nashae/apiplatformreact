import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import TableLoader from "../components/loaders/TableLoader";
import Pagination from "../components/Pagination";
import customersAPI from "../services/customersAPI";

const CustomersPage = (props) => {
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    
    const itemsPerPage = 10;

    
    //recuperation des customers
    const fetchCustomers = async () => {
        try {
            const data = await customersAPI.findAll();
            setCustomers(data);
            setLoading(false)
        } catch(error){
            console.log(error.response);
            toast.error("Echec lors de la récupération des clients");
        }
    }
    
    //affichage des customers au chargement 
    useEffect(() => {
        fetchCustomers();
    }, []);
    
    //changement de page
    const handlePageChange = (page) => {
        setCurrentPage(page);
    }
    
    //suppression d'un customer
    const handleDelete =  async id => {
        const originalCustomers = [...customers];
        setCustomers(customers.filter((customer) => customer.id !== id));
        try {
            await customersAPI.delete(id);
            toast.success("client supprimé");
        } catch(error) {
            setCustomers(originalCustomers);
            toast.error("La suppression a echoué");
        }
    };
    
    //recherche
    const handleSearch = event => {
        const value = event.currentTarget.value;
        setSearch(value);
        setCurrentPage(1);
    }
    
    //filtrage des customers en fonction de la recherche
    const filteredCustomers = customers.filter(
        c => 
            c.firstName.toLowerCase().includes(search.toLowerCase()) || 
            c.lastName.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase()) ||
            (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
    );

    //pagination
    const paginatedCustomers = Pagination.getData(filteredCustomers, currentPage, itemsPerPage);
    
    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                <h1>Liste des clients</h1>
                <Link to="/customers/new" className="btn btn-primary">Créer un client</Link>
            </div>

            <div className="form-group">
                <input type="text" onChange={handleSearch} value={search} className="form-control" placeholder="Rechercher..."/>
            </div>

            <table className="table table-hover">
                {!loading && (
                <>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Client</th>
                        <th>Email</th>
                        <th>Entreprise</th>
                        <th className="text-center">Factures</th>
                        <th className="text-center">Montant total</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedCustomers.map((customer) => (
                        <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td>
                                <Link to={"/customers/" + customer.id}>
                                    {customer.firstName} {customer.lastName}
                                </Link>
                            </td>
                            <td>{customer.email}</td>
                            <td>{customer.company}</td>
                            <td className="text-center">
                                <span className="badge bg-primary text-white">
                                    {customer.invoices.length}
                                </span>
                            </td>
                            <td className="text-center">
                                {customer.totalAmount.toLocaleString()} €
                            </td>
                            <td>
                                <Link to={"/customers/" + customer.id} className="btn btn-sm btn-info mr-1">Editer</Link >
                                <button
                                    disabled={customer.invoices.length > 0}
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(customer.id)}
                                >
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
                </>)}
            </table>
            {loading && <TableLoader />}
            {itemsPerPage < filteredCustomers.length &&
                <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} length={filteredCustomers.length} onPageChange={handlePageChange}/>
            } 
            
        </>
    );
};

export default CustomersPage;
