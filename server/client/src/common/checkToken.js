export default async function checkToken() {
    console.log(localStorage.getItem('acmconnect_jwt_token'))
    const loggedIn = localStorage.getItem('acmconnect_jwt_token') !== null;
    console.log(loggedIn)
    return loggedIn;
};