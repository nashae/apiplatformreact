import axios from "axios";

function findAll() {
    return axios
        .get("https://127.0.0.1:8000/api/customers/")
        .then((response) => response.data["hydra:member"]);
}

function deleteCustomer(id) {
    return axios
        .delete(`https://127.0.0.1:8000/api/customers/${id}`)
        .then((response) => console.log("ok", response));
}

function find(id) {
    axios
        .get("https://127.0.0.1:8000/api/customers/" + id)
        .then((response) => response.data);
}

function update(id, customer){
    axios.put("https://127.0.0.1:8000/api/customers/" + id, customer);
    }

function createCustomer(customer){
    axios.post("https://127.0.0.1:8000/api/customers", customer)
}

export default {
    findAll,
    delete: deleteCustomer,
    find,
    update,
    create: createCustomer
};
