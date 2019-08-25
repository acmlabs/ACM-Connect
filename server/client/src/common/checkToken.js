export default async function checkToken() {
    const res = await fetch('/api/checkToken');
    console.log(`Logged in? ${res.status === 200}`);

    return (res.status === 200);
};