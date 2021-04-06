import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "../components/Pagination";

const CustomersPageWithPagination = (props) => {
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(true)

    const itemsPerPage = 10;

    useEffect(() => {
        axios
            .get(`https://127.0.0.1:8000/api/customers?pagination=true&count=${itemsPerPage}&page=${currentPage}`)
            .then((response) => {
                setCustomers(response.data["hydra:member"]);
                setTotalItems(response.data["hydra:totalItems"]);
                setLoading(false);
            })
            .catch((error) => console.log(error.response));
    }, [currentPage]);

    const handlePageChange = (page) => {
        setLoading(true);
        setCurrentPage(page);
    }

    const handleDelete = (id) => {
        const originalCustomers = [...customers];
        setCustomers(customers.filter((customer) => customer.id !== id));
        axios
            .delete(`https://127.0.0.1:8000/api/customers/${id}`)
            .then((response) => console.log("ok", response))
            .catch((error) => {
                setCustomers(originalCustomers);
                console.log("ko", error.response);
            });
    };


    //const paginatedCustomers = Pagination.getData(customers, currentPage, itemsPerPage);

    return (
        <>
            <h1>Liste des clients pagination</h1>
            <table className="table table-hover">
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
                    {loading && (
                        <tr>
                            <td>Chargement ...</td>
                        </tr>
                    )}
                    {!loading && customers.map((customer) => (
                        <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td>
                                <a href="#">
                                    {customer.firstName} {customer.lastName}
                                </a>
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
            </table>
            <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} length={totalItems} onPageChange={handlePageChange}/> 
            
        </>
    );
};

export default CustomersPageWithPagination;
