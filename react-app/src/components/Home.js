import React from 'react';
import Jumbotron from './Jumbotron'

function Home() {
    return (
        <div className="container">
            <h1>Home Page</h1>
        </div>
    )
}

// import React from 'react';
// import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';

const BasicTable = () => {
    return (
        <div className='container'>
            <Jumbotron/>
            <hr></hr>
            <table>
                <tbody>
                    <tr>
                        <td>High Score</td>
                        <td>268</td>
                    </tr>
                    <tr>
                        <td>Average Score</td>
                        <td>268</td>
                    </tr>
                    <tr>
                        <td>Low Score</td>
                        <td>4</td>
                    </tr>
                    <tr>
                        <td>Most Common Opponent</td>
                        <td>Kenny</td>
                    </tr>
                    <tr>
                        <td>Opponent You Play Best Against</td>
                        <td>Kenny</td>
                    </tr>
                    <tr>
                        <td>Opponent You Play Worst Again</td>
                        <td>Casey</td>
                    </tr>
                </tbody>
            </table>
            <hr></hr>
            <button type="button" className="btn btn-outline-dark">Start New Session</button>
        </div>
    );
}

export default BasicTable;
// export default Home