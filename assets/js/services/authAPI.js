import axios from "axios";
import jwtDecode from "jwt-decode";

//suppression du token du local storage et d'axios
function logout() {
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers['Authorization'];
}

function setAxiosToken(token) {
    axios.defaults.headers["Authorization"] = "Bearer " + token;
}

//ajout du token dans storage et axios
function authenticate(credentials) {
    return axios
        .post("https://127.0.0.1:8000/api/login_check", credentials)
        .then((response) => response.data.token)
        .then((token) => {
            window.localStorage.setItem("authToken", token);
            setAxiosToken(token)
        });
}

//mis en place du token jwt
function setup() {
    const token = window.localStorage.getItem('authToken');
    if(token){
        const jwtData = jwtDecode(token);
        if(jwtData.exp * 1000 > new Date().getTime()){
            setAxiosToken(token);
        }
    } 
}

//verif si auth valide
function isAuthenticated() {
    const token = window.localStorage.getItem('authToken');
    if(token){
        const jwtData = jwtDecode(token);
        if(jwtData.exp * 1000 > new Date().getTime()){
            return true;
        }
        return false
    } 
    return false;
}

export default {
    authenticate,
    logout,
    setup,
    isAuthenticated
};
