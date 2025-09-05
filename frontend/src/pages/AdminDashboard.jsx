import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { api } = useAuth();

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [statsRes, usersRes, storesRes] = await Promise.all([
                api.get('/api/stores/dashboard-stats'),
                api.get('/api/users'),
                api.get('/api/stores')
            ]);
            setStats(statsRes.data);
            setUsers(usersRes.data);
            setStores(storesRes.data);
        } catch (err) {
            setError('Failed to fetch dashboard data.');
        } finally {
            setLoading(false);
        }
    }, [api]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) {
        return (
             <div className="dashboard-container">
                <Header />
                <main className="dashboard-content"><p>Loading admin dashboard...</p></main>
            </div>
        );
    }
     if (error) {
        return (
             <div className="dashboard-container">
                <Header />
                <main className="dashboard-content"><p className="error-message">{error}</p></main>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <Header />
            <main className="dashboard-content">
                <h2>Admin Dashboard</h2>
                
                <div className="stats-grid">
                    <div className="stats-card">
                        <h3>Total Users</h3>
                        <p className="stat-number">{stats.totalUsers}</p>
                    </div>
                    <div className="stats-card">
                        <h3>Total Stores</h3>
                        <p className="stat-number">{stats.totalStores}</p>
                    </div>
                    <div className="stats-card">
                        <h3>Total Ratings</h3>
                        <p className="stat-number">{stats.totalRatings}</p>
                    </div>
                </div>

                <h3>Manage Users</h3>
                <div className="table-container">
                     <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Address</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.address}</td>
                                    <td>{user.role}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <h3>Manage Stores</h3>
                 <div className="table-container">
                     <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Address</th>
                                <th>Overall Rating</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stores.map(store => (
                                <tr key={store.id}>
                                    <td>{store.name}</td>
                                    <td>{store.email}</td>
                                    <td>{store.address}</td>
                                    <td>{store.overallRating}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
