import react from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import CountryFlow from './components/CountryFlow';

function App() {
    return (
        <div>
            {/* Simple Navigation Bar */}
            <nav style={{
                height: '50px',
                background: '#f4f4f4',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                padding: '0 20px',
                borderBottom: '1px solid #ddd'
            }}>
                {/* <Link to="/" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>Home</Link> */}
                <Link to="/flow" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>View Flow</Link>
            </nav>

            {/* Route Configuration */}
            <Routes>
                <Route path="/" element={""} />
                <Route path="/flow" element={<CountryFlow />} />
            </Routes>
        </div>);
}

export default App
