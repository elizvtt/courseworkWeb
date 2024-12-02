import { useEffect, useState } from 'react';
import './client.css';

function ClientApp() {
    const [client, setClients] = useState([]);

    useEffect(() => {
        populateClients();
    }, []);

    const contents = client.length === 0
        ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
        : <div className="container">
            <table className="table table-striped" aria-labelledby="tableLabel">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Date of Birth</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Bonus Point</th>
                    </tr>
                </thead>
                <tbody>
                    {client.map((clientItem) => {
                    const formattedDate = new Date(clientItem.dateBirth).toLocaleDateString('uk-UK', {year: 'numeric', month: 'long', day: 'numeric'});
                    
                    const formatPhoneNumber = (phoneNumber) => {
                        const cleaned = phoneNumber.replace(/\D/g, '');
                        const withCountryCode = cleaned.length === 10 ? `38${cleaned}` : cleaned;
                        const match = withCountryCode.match(/^(\d{2})(\d{3})(\d{3})(\d{4})$/);
                        return match ? `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}` : phoneNumber;
                    };
                  
                    const formattedPhone = formatPhoneNumber(clientItem.phoneNumber);

                    return (
                        <tr key={clientItem.id}>
                            <td>{clientItem.id}</td>
                            <td>{clientItem.fullName}</td>
                            <td>{formattedDate}</td>
                            <td>{clientItem.email}</td>
                            <td>{formattedPhone}</td>
                            <td>{clientItem.bonusPoints}</td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>;

    return (
        <div>
            <h1 id="tableLabel">Clients</h1>
            {contents}
        </div>
    );

    async function populateClients() {
        const response = await fetch('http://localhost:5175/api/Clients');
        const data = await response.json();
        setClients(data);
    }  
}

export default ClientApp;
