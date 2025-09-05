<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StoreRate - Modern Design</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'primary': '#6366f1',
                        'secondary': '#8b5cf6',
                        'accent': '#06b6d4',
                        'success': '#10b981',
                        'warning': '#f59e0b',
                        'error': '#ef4444'
                    }
                }
            }
        }
    </script>
    <style>
        body { font-family: 'Inter', sans-serif; }
        .card-hover { transition: all 0.3s ease; }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
        .fade-in { animation: fadeIn 0.5s ease-in; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    </style>
</head>
<body class="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
    <div id="root"></div>

    <script type="text/babel">
        const { useState, useEffect } = React;

        // Sample Data
        const initialData = {
            users: [
                { id: 1, name: "Rajesh Kumar Sharma Administrator", email: "admin@storerate.com", address: "Plot No. 15, Baner Road, Baner, Pune, Maharashtra 411045", role: "admin", password: "Admin123!" },
                { id: 2, name: "Priya Anand Patil Customer", email: "priya@email.com", address: "Flat 302, Koregaon Park Society, Koregaon Park, Pune, Maharashtra 411001", role: "user", password: "User123!" },
                { id: 3, name: "Arjun Vishwas Deshmukh Owner", email: "arjun@coffeeshop.com", address: "Shop No. 12, FC Road, Deccan Gymkhana, Pune, Maharashtra 411004", role: "owner", password: "Owner123!", rating: 4.5 }
            ],
            stores: [
                { id: 1, name: "Cafe Pune Central", email: "info@cafepunecentral.com", address: "Ground Floor, MG Road, Camp Area, Pune, Maharashtra 411001", rating: 4.5, ownerId: 3 },
                { id: 2, name: "Fresh Mart Grocery", email: "contact@freshmart.com", address: "Shop 45-46, Aundh IT Park, Aundh, Pune, Maharashtra 411007", rating: 4.2, ownerId: 3 },
                { id: 3, name: "Digital Electronics Hub", email: "support@digitalhub.com", address: "2nd Floor, Shivaji Nagar Market, Shivaji Nagar, Pune, Maharashtra 411005", rating: 3.8, ownerId: 3 }
            ],
            ratings: [
                { id: 1, userId: 2, storeId: 1, rating: 5, date: "2024-01-15" },
                { id: 2, userId: 2, storeId: 2, rating: 4, date: "2024-01-14" },
                { id: 3, userId: 2, storeId: 3, rating: 3, date: "2024-01-13" }
            ]
        };

        // Header Component
        const Header = ({ user, onLogout }) => (
            <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-xl">SR</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">StoreRate</h1>
                                <p className="text-sm text-gray-600">Modern Design</p>
                            </div>
                        </div>
                        {user && (
                            <div className="flex items-center space-x-4">
                                <div className="text-right">
                                    <p className="font-semibold text-gray-800">{user.name}</p>
                                    <p className="text-sm text-gray-600 capitalize">{user.role}</p>
                                </div>
                                <button
                                    onClick={onLogout}
                                    className="px-4 py-2 bg-gradient-to-r from-error to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>
        );

        // Star Rating Component
        const StarRating = ({ rating, onRatingChange, interactive = false, size = "text-xl" }) => {
            const [hoverRating, setHoverRating] = useState(0);

            return (
                <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            className={`${size} ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''} ${
                                star <= (interactive ? (hoverRating || rating) : rating) ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                            onClick={() => interactive && onRatingChange && onRatingChange(star)}
                            onMouseEnter={() => interactive && setHoverRating(star)}
                            onMouseLeave={() => interactive && setHoverRating(0)}
                        >
                            ★
                        </span>
                    ))}
                </div>
            );
        };

        // Login Component
        const LoginForm = ({ onLogin, onAddUser }) => {
            const [isSignUp, setIsSignUp] = useState(false);
            const [formData, setFormData] = useState({ 
                name: '',
                email: '', 
                password: '',
                confirmPassword: '',
                address: ''
            });
            const [errors, setErrors] = useState({});

            const validateSignUp = () => {
                const newErrors = {};
                
                if (formData.name.length < 20 || formData.name.length > 60) {
                    newErrors.name = 'Name must be 20-60 characters';
                }
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                    newErrors.email = 'Invalid email format';
                }
                if (formData.address.length > 400) {
                    newErrors.address = 'Address must be under 400 characters';
                }
                if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/.test(formData.password)) {
                    newErrors.password = 'Password must be 8-16 chars with 1 uppercase and 1 special character';
                }
                if (formData.password !== formData.confirmPassword) {
                    newErrors.confirmPassword = 'Passwords do not match';
                }

                setErrors(newErrors);
                return Object.keys(newErrors).length === 0;
            };

            const handleSubmit = (e) => {
                e.preventDefault();
                
                if (isSignUp) {
                    if (validateSignUp()) {
                        const newUser = {
                            name: formData.name,
                            email: formData.email,
                            address: formData.address,
                            password: formData.password,
                            role: 'user'
                        };
                        onAddUser(newUser);
                        onLogin(newUser);
                    }
                } else {
                    const user = initialData.users.find(u => u.email === formData.email && u.password === formData.password);
                    if (user) {
                        onLogin(user);
                    } else {
                        setErrors({ general: 'Invalid email or password' });
                    }
                }
            };

            return (
                <div className="min-h-screen flex items-center justify-center p-6">
                    <div className="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 card-hover fade-in">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <span className="text-white font-bold text-2xl">SR</span>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800">
                                {isSignUp ? 'Create Account' : 'Welcome Back'}
                            </h2>
                            <p className="text-gray-600 mt-2">
                                {isSignUp ? 'Sign up for a new account' : 'Sign in to your account'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {isSignUp && (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name (20-60 characters)</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                                            placeholder="Your full name"
                                            required
                                        />
                                        {errors.name && <p className="text-error text-sm mt-1">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Address (max 400 characters)</label>
                                        <textarea
                                            value={formData.address}
                                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm resize-none"
                                            rows="3"
                                            placeholder="Your address"
                                            required
                                        />
                                        {errors.address && <p className="text-error text-sm mt-1">{errors.address}</p>}
                                    </div>
                                </>
                            )}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                                    placeholder="your@email.com"
                                    required
                                />
                                {errors.email && <p className="text-error text-sm mt-1">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                                    placeholder={isSignUp ? "8-16 chars, 1 uppercase, 1 special" : "••••••••"}
                                    required
                                />
                                {errors.password && <p className="text-error text-sm mt-1">{errors.password}</p>}
                            </div>
                            {isSignUp && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                                    <input
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                                        placeholder="Confirm your password"
                                        required
                                    />
                                    {errors.confirmPassword && <p className="text-error text-sm mt-1">{errors.confirmPassword}</p>}
                                </div>
                            )}
                            {errors.general && (
                                <div className="text-error text-sm bg-red-50 p-3 rounded-lg">{errors.general}</div>
                            )}
                            <button
                                type="submit"
                                className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg"
                            >
                                {isSignUp ? 'Create Account' : 'Sign In'}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <button
                                onClick={() => {
                                    setIsSignUp(!isSignUp);
                                    setFormData({ name: '', email: '', password: '', confirmPassword: '', address: '' });
                                    setErrors({});
                                }}
                                className="text-primary hover:text-secondary font-medium transition-colors"
                            >
                                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                            </button>
                        </div>
                    </div>
                </div>
            );
        };

        // Admin Dashboard
        const AdminDashboard = ({ data, onAddUser, onAddStore }) => {
            const [activeTab, setActiveTab] = useState('dashboard');
            const [searchTerm, setSearchTerm] = useState('');
            const [sortField, setSortField] = useState('name');
            const [sortDirection, setSortDirection] = useState('asc');

            const stats = {
                totalUsers: data.users.length,
                totalStores: data.stores.length,
                totalRatings: data.ratings.length
            };

            const filteredUsers = data.users.filter(user =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.role.toLowerCase().includes(searchTerm.toLowerCase())
            ).sort((a, b) => {
                const aVal = a[sortField]?.toString().toLowerCase() || '';
                const bVal = b[sortField]?.toString().toLowerCase() || '';
                return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            });

            const filteredStores = data.stores.filter(store =>
                store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                store.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                store.address.toLowerCase().includes(searchTerm.toLowerCase())
            ).sort((a, b) => {
                const aVal = a[sortField]?.toString().toLowerCase() || '';
                const bVal = b[sortField]?.toString().toLowerCase() || '';
                return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            });

            return (
                <div className="max-w-7xl mx-auto p-6 space-y-6">
                    {/* Navigation Tabs */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-2">
                        <div className="flex space-x-2">
                            {[
                                { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                                { id: 'users', label: 'Users', icon: '👥' },
                                { id: 'stores', label: 'Stores', icon: '🏪' },
                                { id: 'add-user', label: 'Add User', icon: '➕' },
                                { id: 'add-store', label: 'Add Store', icon: '🏪➕' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                                        activeTab === tab.id
                                            ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    <span className="mr-2">{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Dashboard Overview */}
                    {activeTab === 'dashboard' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 fade-in">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg card-hover">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-100">Total Users</p>
                                        <p className="text-3xl font-bold">{stats.totalUsers}</p>
                                    </div>
                                    <div className="text-4xl">👥</div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg card-hover">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-green-100">Total Stores</p>
                                        <p className="text-3xl font-bold">{stats.totalStores}</p>
                                    </div>
                                    <div className="text-4xl">🏪</div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg card-hover">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-purple-100">Total Ratings</p>
                                        <p className="text-3xl font-bold">{stats.totalRatings}</p>
                                    </div>
                                    <div className="text-4xl">⭐</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Users Management */}
                    {activeTab === 'users' && (
                        <div className="space-y-6 fade-in">
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                                    <h3 className="text-2xl font-bold text-gray-800">Users Management</h3>
                                    <div className="flex space-x-4">
                                        <input
                                            type="text"
                                            placeholder="Search users..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                        <select
                                            value={`${sortField}-${sortDirection}`}
                                            onChange={(e) => {
                                                const [field, direction] = e.target.value.split('-');
                                                setSortField(field);
                                                setSortDirection(direction);
                                            }}
                                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        >
                                            <option value="name-asc">Name A-Z</option>
                                            <option value="name-desc">Name Z-A</option>
                                            <option value="email-asc">Email A-Z</option>
                                            <option value="email-desc">Email Z-A</option>
                                            <option value="role-asc">Role A-Z</option>
                                            <option value="role-desc">Role Z-A</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filteredUsers.map(user => (
                                        <div key={user.id} className="bg-white rounded-xl p-4 shadow-md card-hover border border-gray-100">
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="font-semibold text-gray-800 truncate">{user.name}</h4>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    user.role === 'admin' ? 'bg-red-100 text-red-800' :
                                                    user.role === 'owner' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-green-100 text-green-800'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">{user.email}</p>
                                            <p className="text-xs text-gray-500 mb-3">{user.address}</p>
                                            {user.role === 'owner' && user.rating && (
                                                <div className="flex items-center space-x-2">
                                                    <StarRating rating={user.rating} size="text-sm" />
                                                    <span className="text-sm font-medium">{user.rating}</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Stores Management */}
                    {activeTab === 'stores' && (
                        <div className="space-y-6 fade-in">
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                                    <h3 className="text-2xl font-bold text-gray-800">Stores Management</h3>
                                    <input
                                        type="text"
                                        placeholder="Search stores..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {filteredStores.map(store => (
                                        <div key={store.id} className="bg-white rounded-xl p-6 shadow-md card-hover border border-gray-100">
                                            <h4 className="font-semibold text-gray-800 mb-2">{store.name}</h4>
                                            <p className="text-sm text-gray-600 mb-2">{store.email}</p>
                                            <p className="text-xs text-gray-500 mb-4">{store.address}</p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <StarRating rating={store.rating} size="text-sm" />
                                                    <span className="text-sm font-medium">{store.rating}</span>
                                                </div>
                                                <span className="text-xs text-gray-500">
                                                    {data.ratings.filter(r => r.storeId === store.id).length} reviews
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Add User Form */}
                    {activeTab === 'add-user' && (
                        <AddUserForm onAddUser={onAddUser} />
                    )}

                    {/* Add Store Form */}
                    {activeTab === 'add-store' && (
                        <AddStoreForm onAddStore={onAddStore} />
                    )}
                </div>
            );
        };

        // Add User Form Component
        const AddUserForm = ({ onAddUser }) => {
            const [formData, setFormData] = useState({
                name: '',
                email: '',
                address: '',
                password: '',
                role: 'user'
            });
            const [errors, setErrors] = useState({});

            const validateForm = () => {
                const newErrors = {};
                
                if (formData.name.length < 20 || formData.name.length > 60) {
                    newErrors.name = 'Name must be 20-60 characters';
                }
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                    newErrors.email = 'Invalid email format';
                }
                if (formData.address.length > 400) {
                    newErrors.address = 'Address must be under 400 characters';
                }
                if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/.test(formData.password)) {
                    newErrors.password = 'Password must be 8-16 chars with 1 uppercase and 1 special character';
                }

                setErrors(newErrors);
                return Object.keys(newErrors).length === 0;
            };

            const handleSubmit = (e) => {
                e.preventDefault();
                if (validateForm()) {
                    onAddUser(formData);
                    setFormData({ name: '', email: '', address: '', password: '', role: 'user' });
                }
            };

            return (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 max-w-2xl mx-auto fade-in">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Add New User</h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Name (20-60 characters)</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Full name"
                                required
                            />
                            {errors.name && <p className="text-error text-sm mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="email@example.com"
                                required
                            />
                            {errors.email && <p className="text-error text-sm mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Address (max 400 characters)</label>
                            <textarea
                                value={formData.address}
                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                                rows="3"
                                placeholder="Full address"
                                required
                            />
                            {errors.address && <p className="text-error text-sm mt-1">{errors.address}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="8-16 chars, 1 uppercase, 1 special"
                                required
                            />
                            {errors.password && <p className="text-error text-sm mt-1">{errors.password}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({...formData, role: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value="user">Normal User</option>
                                <option value="admin">System Administrator</option>
                                <option value="owner">Store Owner</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-success to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg"
                        >
                            Add User
                        </button>
                    </form>
                </div>
            );
        };

        // Add Store Form Component
        const AddStoreForm = ({ onAddStore }) => {
            const [formData, setFormData] = useState({
                name: '',
                email: '',
                address: ''
            });

            const handleSubmit = (e) => {
                e.preventDefault();
                onAddStore(formData);
                setFormData({ name: '', email: '', address: '' });
            };

            return (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 max-w-2xl mx-auto fade-in">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Add New Store</h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Store Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Store name"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="store@example.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                            <textarea
                                value={formData.address}
                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                                rows="3"
                                placeholder="Store address"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg"
                        >
                            Add Store
                        </button>
                    </form>
                </div>
            );
        };

        // User Dashboard
        const UserDashboard = ({ data, user, onUpdatePassword, onSubmitRating }) => {
            const [activeTab, setActiveTab] = useState('stores');
            const [searchTerm, setSearchTerm] = useState('');
            const [userRatings, setUserRatings] = useState({});

            useEffect(() => {
                const ratings = {};
                data.ratings.filter(r => r.userId === user.id).forEach(r => {
                    ratings[r.storeId] = r.rating;
                });
                setUserRatings(ratings);
            }, [data.ratings, user.id]);

            const filteredStores = data.stores.filter(store =>
                store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                store.address.toLowerCase().includes(searchTerm.toLowerCase())
            );

            const handleRatingSubmit = (storeId, rating) => {
                setUserRatings(prev => ({ ...prev, [storeId]: rating }));
                onSubmitRating(user.id, storeId, rating);
            };

            return (
                <div className="max-w-7xl mx-auto p-6 space-y-6">
                    {/* Navigation */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-2">
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setActiveTab('stores')}
                                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                                    activeTab === 'stores'
                                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                🏪 Stores
                            </button>
                            <button
                                onClick={() => setActiveTab('password')}
                                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                                    activeTab === 'password'
                                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                🔒 Change Password
                            </button>
                        </div>
                    </div>

                    {activeTab === 'stores' && (
                        <div className="space-y-6 fade-in">
                            {/* Search */}
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
                                <input
                                    type="text"
                                    placeholder="Search stores by name or address..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>

                            {/* Stores Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredStores.map(store => (
                                    <StoreCard
                                        key={store.id}
                                        store={store}
                                        userRating={userRatings[store.id] || 0}
                                        onRatingSubmit={handleRatingSubmit}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'password' && (
                        <PasswordChangeForm onUpdatePassword={onUpdatePassword} />
                    )}
                </div>
            );
        };

        // Store Card Component
        const StoreCard = ({ store, userRating, onRatingSubmit }) => {
            const [currentRating, setCurrentRating] = useState(userRating);
            const [isSubmitting, setIsSubmitting] = useState(false);

            const handleSubmit = async () => {
                if (currentRating === 0) return;
                setIsSubmitting(true);
                setTimeout(() => {
                    onRatingSubmit(store.id, currentRating);
                    setIsSubmitting(false);
                }, 1000);
            };

            return (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 card-hover">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{store.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{store.address}</p>
                    
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-600 mb-2">Overall Rating:</p>
                            <div className="flex items-center space-x-2">
                                <StarRating rating={store.rating} />
                                <span className="font-semibold">{store.rating}</span>
                            </div>
                        </div>
                        
                        <div>
                            <p className="text-sm text-gray-600 mb-2">Your Rating:</p>
                            <div className="flex items-center space-x-3">
                                <StarRating
                                    rating={currentRating}
                                    onRatingChange={setCurrentRating}
                                    interactive={true}
                                />
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || currentRating === 0}
                                    className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Submitting...' : userRating ? 'Update' : 'Submit'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        };

        // Password Change Form
        const PasswordChangeForm = ({ onUpdatePassword }) => {
            const [formData, setFormData] = useState({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            const [errors, setErrors] = useState({});

            const handleSubmit = (e) => {
                e.preventDefault();
                const newErrors = {};

                if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/.test(formData.newPassword)) {
                    newErrors.newPassword = 'Password must be 8-16 chars with 1 uppercase and 1 special character';
                }
                if (formData.newPassword !== formData.confirmPassword) {
                    newErrors.confirmPassword = 'Passwords do not match';
                }

                setErrors(newErrors);

                if (Object.keys(newErrors).length === 0) {
                    onUpdatePassword(formData.newPassword);
                    setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }
            };

            return (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 max-w-md mx-auto fade-in">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Change Password</h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                            <input
                                type="password"
                                value={formData.currentPassword}
                                onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                            <input
                                type="password"
                                value={formData.newPassword}
                                onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="8-16 chars, 1 uppercase, 1 special"
                                required
                            />
                            {errors.newPassword && <p className="text-error text-sm mt-1">{errors.newPassword}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                            <input
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                                required
                            />
                            {errors.confirmPassword && <p className="text-error text-sm mt-1">{errors.confirmPassword}</p>}
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-success to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg"
                        >
                            Update Password
                        </button>
                    </form>
                </div>
            );
        };

        // Store Owner Dashboard
        const OwnerDashboard = ({ data, user, onUpdatePassword }) => {
            const [activeTab, setActiveTab] = useState('dashboard');
            
            const ownerStore = data.stores.find(s => s.ownerId === user.id);
            const storeRatings = data.ratings.filter(r => r.storeId === ownerStore?.id);
            const ratingUsers = storeRatings.map(rating => {
                const ratingUser = data.users.find(u => u.id === rating.userId);
                return { ...rating, userName: ratingUser?.name, userEmail: ratingUser?.email };
            });

            return (
                <div className="max-w-7xl mx-auto p-6 space-y-6">
                    {/* Navigation */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-2">
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setActiveTab('dashboard')}
                                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                                    activeTab === 'dashboard'
                                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                📊 Dashboard
                            </button>
                            <button
                                onClick={() => setActiveTab('password')}
                                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                                    activeTab === 'password'
                                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                🔒 Change Password
                            </button>
                        </div>
                    </div>

                    {activeTab === 'dashboard' && ownerStore && (
                        <div className="space-y-6 fade-in">
                            {/* Store Summary */}
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-3xl font-bold mb-2">{ownerStore.name}</h2>
                                        <p className="text-blue-100">{ownerStore.address}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <StarRating rating={ownerStore.rating} size="text-2xl" />
                                            <span className="text-3xl font-bold">{ownerStore.rating}</span>
                                        </div>
                                        <p className="text-blue-100">Based on {storeRatings.length} reviews</p>
                                    </div>
                                </div>
                            </div>

                            {/* Ratings Table */}
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
                                <div className="p-6 border-b border-gray-200">
                                    <h3 className="text-2xl font-bold text-gray-800">Customer Ratings</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Rating</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {ratingUsers.map((rating, index) => (
                                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{rating.userName}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{rating.userEmail}</td>
                                                    <td className="px-6 py-4">
                                                        <StarRating rating={rating.rating} size="text-sm" />
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {new Date(rating.date).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'password' && (
                        <PasswordChangeForm onUpdatePassword={onUpdatePassword} />
                    )}
                </div>
            );
        };

        // Main App Component
        const App = () => {
            const [user, setUser] = useState(null);
            const [data, setData] = useState(initialData);

            const handleLogin = (userData) => {
                setUser(userData);
            };

            const handleLogout = () => {
                setUser(null);
            };

            const handleAddUser = (userData) => {
                const newUser = {
                    id: data.users.length + 1,
                    ...userData
                };
                setData(prev => ({
                    ...prev,
                    users: [...prev.users, newUser]
                }));
            };

            const handleAddStore = (storeData) => {
                const newStore = {
                    id: data.stores.length + 1,
                    ...storeData,
                    rating: 0,
                    ownerId: user.id
                };
                setData(prev => ({
                    ...prev,
                    stores: [...prev.stores, newStore]
                }));
            };

            const handleUpdatePassword = (newPassword) => {
                setData(prev => ({
                    ...prev,
                    users: prev.users.map(u => 
                        u.id === user.id ? { ...u, password: newPassword } : u
                    )
                }));
            };

            const handleSubmitRating = (userId, storeId, rating) => {
                const existingRatingIndex = data.ratings.findIndex(r => r.userId === userId && r.storeId === storeId);
                
                if (existingRatingIndex >= 0) {
                    setData(prev => ({
                        ...prev,
                        ratings: prev.ratings.map((r, index) => 
                            index === existingRatingIndex ? { ...r, rating, date: new Date().toISOString().split('T')[0] } : r
                        )
                    }));
                } else {
                    const newRating = {
                        id: data.ratings.length + 1,
                        userId,
                        storeId,
                        rating,
                        date: new Date().toISOString().split('T')[0]
                    };
                    setData(prev => ({
                        ...prev,
                        ratings: [...prev.ratings, newRating]
                    }));
                }

                // Update store average rating
                const storeRatings = data.ratings.filter(r => r.storeId === storeId);
                const avgRating = storeRatings.reduce((sum, r) => sum + r.rating, 0) / storeRatings.length;
                
                setData(prev => ({
                    ...prev,
                    stores: prev.stores.map(s => 
                        s.id === storeId ? { ...s, rating: Math.round(avgRating * 10) / 10 } : s
                    )
                }));
            };

            return (
                <div className="min-h-screen">
                    {user && <Header user={user} onLogout={handleLogout} />}
                    
                    {!user ? (
                        <LoginForm onLogin={handleLogin} onAddUser={handleAddUser} />
                    ) : user.role === 'admin' ? (
                        <AdminDashboard 
                            data={data} 
                            onAddUser={handleAddUser}
                            onAddStore={handleAddStore}
                        />
                    ) : user.role === 'user' ? (
                        <UserDashboard 
                            data={data}
                            user={user}
                            onUpdatePassword={handleUpdatePassword}
                            onSubmitRating={handleSubmitRating}
                        />
                    ) : (
                        <OwnerDashboard 
                            data={data}
                            user={user}
                            onUpdatePassword={handleUpdatePassword}
                        />
                    )}
                </div>
            );
        };

        ReactDOM.render(<App />, document.getElementById('root'));
    </script>
<script>(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'9795914662e8465e',t:'MTc1NjkwNTg2Ny4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();</script></body>
</html>
