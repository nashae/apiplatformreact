import React , {useState, useEffect} from 'react';
import Pagination from "../components/Pagination";
import moment from "moment";
import invoicesAPI from "../services/invoicesAPI";

const STATUS_CLASSES = {
    PAID: "success",
    SENT: "info",
    CANCELLED: "danger"
}

const STATUS_LABELS = {
    PAID: "Payée",
    SENT: "Envoyée",
    CANCELLED: "Annulée"
}

const InvoicesPage = (props) => {

    const [invoices, setInvoices] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');

    const itemsPerPage = 10;

    //recuperation des invoices
    const fetchInvoices = async () => {
        try {
            const data = await invoicesAPI.findAll()
            setInvoices(data);
            console.log(data);
        } catch(error) {
            console.log(error.response);
        }
    }
    
    useEffect(() => {
        fetchInvoices();
    },[])

    //formatage des dates
    const formatDate = (str) => moment(str).format('DD/MM/YYYY');

    //changement de page
    const handlePageChange = (page) => {
        setCurrentPage(page);
    }

    //recherche
    const handleSearch = event => {
        const value = event.currentTarget.value;
        setSearch(value);
        setCurrentPage(1);
    }

    //supression
    const handleDelete = async id => {
        const originalInvoices = [...invoices];
        setInvoices(invoices.filter(invoice => invoice.id !== id));
        try {
            await invoicesAPI.delete(id)
        } catch (error) {
            console.log(error.response);
            setInvoices(originalInvoices);
        }
    }

    //filtrage des customers en fonction de la recherche
    const filteredInvoices = invoices.filter(
        i => 
            i.customer.firstName.toLowerCase().includes(search.toLowerCase()) || 
            i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
            i.amount.toString().includes(search.toLowerCase()) ||
            STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())
    );

    //pagination
    const paginatedInvoices = Pagination.getData(filteredInvoices , currentPage, itemsPerPage);

    return (
        <>
            <h1>Liste des factures</h1>

            <div className="form-group">
                <input type="text" onChange={handleSearch} value={search} className="form-control" placeholder="Rechercher..."/>
            </div>

            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Numéro</th>
                        <th>Client</th>
                        <th className="text-center">Dâte d'envoi</th>
                        <th className="text-center">Statut</th>
                        <th className="text-center">Montant</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    { paginatedInvoices.map( invoice => 
                        <tr key={invoice.id}>
                            <td>{invoice.chrono}</td>
                            <td>
                                <a href="#">{invoice.customer.firstName} {invoice.customer.lastName}</a>
                            </td>
                            <td className="text-center">{formatDate(invoice.sentAt)}</td>
                            <td className="text-center">
                                <span className={"badge badge-" + STATUS_CLASSES[invoice.status]}>{STATUS_LABELS[invoice.status]}</span>
                            </td>
                            <td className="text-center">{invoice.amount}</td>
                            <td>
                                <button className="btn btn-sm btn-info mr-1">Editer</button>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(invoice.id)}>Supprimer</button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} onPageChange={handlePageChange} length={filteredInvoices.length} />
        </>
    )
}

export default InvoicesPage;