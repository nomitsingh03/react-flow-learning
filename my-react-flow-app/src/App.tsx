import react from 'react';
import { Link, Route, Routes, Navigate } from 'react-router-dom';
import CountryFlow from './components/CountryFlow';
import AgentFlow from './components/AgentFlow';

function App() {
    return (
        <div>
            {/* Simple Navigation Bar */}
            <nav style={{
                height: '50px',
                background: '#111827',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                padding: '0 20px',
                borderBottom: '1px solid #1f2937'
            }}>
                <Link to="/flow" style={{ textDecoration: 'none', color: '#9ca3af', fontWeight: 'bold' }}>View Country Flow</Link>
                <Link to="/agent-flow" style={{ textDecoration: 'none', color: '#f3f4f6', fontWeight: 'bold' }}>AI Agent Flow</Link>
            </nav>

            {/* Route Configuration */}
            <Routes>
                <Route path="/" element={<Navigate to="/agent-flow" replace />} />
                <Route path="/flow" element={<CountryFlow />} />
                <Route path="/agent-flow" element={<AgentFlow />} />
            </Routes>
        </div>);
}

export default App

