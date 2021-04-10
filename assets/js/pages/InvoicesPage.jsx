import React , {useState, useEffect} from 'react';
import Pagination from "../components/Pagination";
import moment from "moment";
import invoicesAPI from "../services/invoicesAPI";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import TableLoader from '../components/loaders/TableLoader';

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
    const [loading, setLoading] = useState(true)

    const itemsPerPage = 10;

    //recuperation des invoices
    const fetchInvoices = async () => {
        try {
            const data = await invoicesAPI.findAll()
            setInvoices(data);
            setLoading(false)
            console.log(data);
        } catch(error) {
            console.log(error.response);
            toast.error("erreur lors du chargement des factures");
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
            await invoicesAPI.delete(id);
            toast.success("la facture a bien été supprimée");
        } catch (error) {
            console.log(error.response);
            toast.error("echec de la suppression");
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
            <div className="d-flex justify-content-between align-items-center">
                <h1>Liste des factures</h1>
                <Link to="/invoices/new" className="btn btn-info">Créer une facture</Link>
            </div>

            <div className="form-group">
                <input type="text" onChange={handleSearch} value={search} className="form-control" placeholder="Rechercher..."/>
            </div>

            <table className="table table-hover">
                {!loading && (
                <>
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
                                <Link to={"/customers/" + invoice.customer.id}>{invoice.customer.firstName} {invoice.customer.lastName}</Link>
                            </td>
                            <td className="text-center">{formatDate(invoice.sentAt)}</td>
                            <td className="text-center">
                                <span className={"badge badge-" + STATUS_CLASSES[invoice.status]}>{STATUS_LABELS[invoice.status]}</span>
                            </td>
                            <td className="text-center">{invoice.amount}</td>
                            <td>
                                <Link to={"/invoices/" + invoice.id} className="btn btn-sm btn-info mr-1">Editer</Link >
                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(invoice.id)}>Supprimer</button>
                            </td>
                        </tr>
                    )}
                </tbody>
                </>
                )}
            </table>
            {loading && <TableLoader />}
            <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} onPageChange={handlePageChange} length={filteredInvoices.length} />
        </>
    )
}

export default InvoicesPage;