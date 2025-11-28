import React, { useState, useEffect } from 'react';
import { ShoppingCart, User, LogOut, Home, Package, Trash2 } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';
import axios from 'axios';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '', role: 'customer' });
  const [menuItem, setMenuItem] = useState({ name: '', description: '', price: '', category: '' });

  // Mock API calls
  const mockLogin = (email, password) => {
    const users = {
      'customer@test.com': { id: '1', name: 'John Doe', email: 'customer@test.com', role: 'customer' },
      'owner@test.com': { id: '2', name: 'Restaurant Owner', email: 'owner@test.com', role: 'owner' },
      'admin@test.com': { id: '3', name: 'Admin User', email: 'admin@test.com', role: 'admin' }
    };
    return users[email] || null;
  };

  const mockRestaurants = [
    { id: '1', name: 'Pizza Palace', cuisine: 'Italian', rating: 4.5, deliveryTime: '30-40 min' },
    { id: '2', name: 'Burger Hub', cuisine: 'American', rating: 4.2, deliveryTime: '25-35 min' },
    { id: '3', name: 'Sushi Express', cuisine: 'Japanese', rating: 4.8, deliveryTime: '40-50 min' }
  ];

  const mockMenuItems = {
    '1': [
      { id: '1', name: 'Margherita Pizza', price: 12.99, category: 'Pizza', description: 'Classic tomato and mozzarella' },
      { id: '2', name: 'Pepperoni Pizza', price: 14.99, category: 'Pizza', description: 'Loaded with pepperoni' }
    ],
    '2': [
      { id: '3', name: 'Classic Burger', price: 8.99, category: 'Burgers', description: 'Beef patty with lettuce and tomato' },
      { id: '4', name: 'Cheese Fries', price: 4.99, category: 'Sides', description: 'Crispy fries with cheese' }
    ],
    '3': [
      { id: '5', name: 'California Roll', price: 10.99, category: 'Sushi', description: '8 pieces of fresh sushi' },
      { id: '6', name: 'Salmon Nigiri', price: 12.99, category: 'Sushi', description: '6 pieces of salmon nigiri' }
    ]
  };

  useEffect(() => {
    if (user && currentPage === 'home') {
      setRestaurants(mockRestaurants);
    }
  }, [user, currentPage]);

 const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post("http://localhost:5000/api/auth/login", {
      email: loginData.email,
      password: loginData.password
    });

    const loggedInUser = res.data.user;
    const token = res.data.token;

    // Save token
    localStorage.setItem("token", token);

    setUser(loggedInUser);
    setCurrentPage(loggedInUser.role === "owner" ? "owner-dashboard" : "home");

  } catch (error) {
    alert("Invalid email or password");
    console.error(error.response?.data || error.message);
  }
};


const handleSignup = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post("http://localhost:5000/api/auth/register", signupData);

    const newUser = res.data.user;
    const token = res.data.token;

    localStorage.setItem("token", token);

    setUser(newUser);
    setCurrentPage(newUser.role === "owner" ? "owner-dashboard" : "home");

  } catch (error) {
    alert(error.response?.data?.error || "Signup failed");
    console.error(error);
  }
};


  const handleLogout = () => {
    setUser(null);
    setCart([]);
    setCurrentPage('login');
  };

  const addToCart = (item) => {
    setCart([...cart, { ...item, restaurantId: selectedRestaurant.id }]);
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const order = {
      id: Date.now().toString(),
      items: [...cart],
      total: calculateTotal(),
      status: 'Pending',
      date: new Date().toLocaleString()
    };
    setOrders([...orders, order]);
    setCart([]);
    setCurrentPage('orders');
  };

  const addMenuItem = (e) => {
    e.preventDefault();
    alert('Menu item added successfully!');
    setMenuItem({ name: '', description: '', price: '', category: '' });
  };

  const styles = {
    container: {
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    loginContainer: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fb923c 0%, #ef4444 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      padding: '32px',
      maxWidth: '400px',
      width: '100%'
    },
    input: {
      width: '100%',
      padding: '10px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      marginBottom: '12px',
      boxSizing: 'border-box'
    },
    button: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#f97316',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    nav: {
      backgroundColor: '#f97316',
      color: 'white',
      padding: '16px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    },
    navContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    navLinks: {
      display: 'flex',
      alignItems: 'center',
      gap: '24px'
    },
    navButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: 'none',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      fontSize: '14px',
      padding: '8px'
    },
    mainContent: {
      backgroundColor: '#f3f4f6',
      minHeight: 'calc(100vh - 64px)'
    },
    contentContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '24px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '24px'
    },
    restaurantCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      transition: 'box-shadow 0.2s'
    },
    cardImage: {
      height: '160px',
      background: 'linear-gradient(135deg, #fb923c 0%, #ef4444 100%)'
    },
    cardContent: {
      padding: '16px'
    }
  };

  // Login Page
  if (currentPage === 'login') {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.card}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', textAlign: 'center', marginBottom: '24px', color: '#1f2937' }}>
            🍕 FoodEase
          </h1>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              Email
            </label>
            <input
              type="email"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              style={styles.input}
            />
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              Password
            </label>
            <input
              type="password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              style={styles.input}
            />
            <button
              onClick={handleLogin}
              style={styles.button}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#ea580c'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#f97316'}
            >
              Login
            </button>
          </div>
          <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#6b7280' }}>
            Don't have an account?{' '}
            <button
              onClick={() => setCurrentPage('signup')}
              style={{ color: '#f97316', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Sign up
            </button>
          </p>
          <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f3f4f6', borderRadius: '8px', fontSize: '12px' }}>
            <p style={{ fontWeight: '600', marginBottom: '8px' }}>Demo Accounts:</p>
            <p>Customer: customer@test.com</p>
            <p>Owner: owner@test.com</p>
            <p>Admin: admin@test.com</p>
          </div>
        </div>
      </div>
    );
  }

  // Signup Page
  if (currentPage === 'signup') {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.card}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', textAlign: 'center', marginBottom: '24px', color: '#1f2937' }}>
            Create Account
          </h1>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              Name
            </label>
            <input
              type="text"
              value={signupData.name}
              onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
              style={styles.input}
            />
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              Email
            </label>
            <input
              type="email"
              value={signupData.email}
              onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
              style={styles.input}
            />
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              Password
            </label>
            <input
              type="password"
              value={signupData.password}
              onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
              style={styles.input}
            />
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              Role
            </label>
            <select
              value={signupData.role}
              onChange={(e) => setSignupData({ ...signupData, role: e.target.value })}
              style={styles.input}
            >
              <option value="customer">Customer</option>
              <option value="owner">Restaurant Owner</option>
            </select>
            <button
              onClick={handleSignup}
              style={styles.button}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#ea580c'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#f97316'}
            >
              Sign Up
            </button>
          </div>
          <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#6b7280' }}>
            Already have an account?{' '}
            <button
              onClick={() => setCurrentPage('login')}
              style={{ color: '#f97316', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Login
            </button>
          </p>
        </div>
      </div>
    );
  }

  // Navigation Bar
  const NavBar = () => (
    <nav style={styles.nav}>
      <div style={styles.navContent}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>🍕 FoodEase</h1>
        <div style={styles.navLinks}>
          <button onClick={() => setCurrentPage('home')} style={styles.navButton}>
            <Home size={20} /> Home
          </button>
          {user.role === 'customer' && (
            <>
              <button onClick={() => setCurrentPage('cart')} style={styles.navButton}>
                <ShoppingCart size={20} /> Cart ({cart.length})
              </button>
              <button onClick={() => setCurrentPage('orders')} style={styles.navButton}>
                <Package size={20} /> Orders
              </button>
            </>
          )}
          {user.role === 'owner' && (
            <button onClick={() => setCurrentPage('owner-dashboard')} style={styles.navButton}>
              <Package size={20} /> Dashboard
            </button>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={20} />
            <span>{user.name}</span>
          </div>
          <button onClick={handleLogout} style={styles.navButton}>
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>
    </nav>
  );

  // Home Page
  if (currentPage === 'home') {
    return (
      <div style={styles.container}>
        <NavBar />
        <div style={styles.mainContent}>
          <div style={styles.contentContainer}>
            <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '24px' }}>Available Restaurants</h2>
            <div style={styles.grid}>
              {restaurants.map((restaurant) => (
                <div key={restaurant.id} style={styles.restaurantCard}>
                  <div style={styles.cardImage}></div>
                  <div style={styles.cardContent}>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>{restaurant.name}</h3>
                    <p style={{ color: '#6b7280', marginBottom: '8px' }}>{restaurant.cuisine}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <span style={{ color: '#fbbf24' }}>⭐ {restaurant.rating}</span>
                      <span style={{ color: '#9ca3af', fontSize: '14px' }}>{restaurant.deliveryTime}</span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedRestaurant(restaurant);
                        setCurrentPage('menu');
                      }}
                      style={{ ...styles.button, marginBottom: 0 }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#ea580c'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#f97316'}
                    >
                      View Menu
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Menu Page
  if (currentPage === 'menu' && selectedRestaurant) {
    const menuItems = mockMenuItems[selectedRestaurant.id] || [];
    return (
      <div style={styles.container}>
        <NavBar />
        <div style={styles.mainContent}>
          <div style={styles.contentContainer}>
            <button
              onClick={() => setCurrentPage('home')}
              style={{ color: '#f97316', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '16px', fontSize: '14px' }}
            >
              ← Back to Restaurants
            </button>
            <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>{selectedRestaurant.name}</h2>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>
              {selectedRestaurant.cuisine} • ⭐ {selectedRestaurant.rating}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px' }}>
              {menuItems.map((item) => (
                <div key={item.id} style={{ ...styles.restaurantCard, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>{item.name}</h3>
                    <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px', marginBottom: '8px' }}>{item.description}</p>
                    <p style={{ color: '#f97316', fontWeight: 'bold' }}>${item.price}</p>
                  </div>
                  <button
                    onClick={() => addToCart(item)}
                    style={{ padding: '12px 24px', backgroundColor: '#f97316', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#ea580c'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#f97316'}
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Cart Page
  if (currentPage === 'cart') {
    return (
      <div style={styles.container}>
        <NavBar />
        <div style={styles.mainContent}>
          <div style={styles.contentContainer}>
            <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '24px' }}>Your Cart</h2>
            {cart.length === 0 ? (
              <div style={{ ...styles.restaurantCard, padding: '32px', textAlign: 'center' }}>
                <p style={{ color: '#6b7280' }}>Your cart is empty</p>
              </div>
            ) : (
              <div style={{ ...styles.restaurantCard, padding: '24px' }}>
                {cart.map((item, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #e5e7eb' }}>
                    <div>
                      <h3 style={{ fontWeight: 'bold' }}>{item.name}</h3>
                      <p style={{ color: '#6b7280' }}>${item.price}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(index)}
                      style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
                <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
                    <span>Total:</span>
                    <span>${calculateTotal()}</span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    style={{ ...styles.button, marginBottom: 0, padding: '16px' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#ea580c'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#f97316'}
                  >
                    Place Order
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Orders Page
  if (currentPage === 'orders') {
    return (
      <div style={styles.container}>
        <NavBar />
        <div style={styles.mainContent}>
          <div style={styles.contentContainer}>
            <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '24px' }}>Your Orders</h2>
            {orders.length === 0 ? (
              <div style={{ ...styles.restaurantCard, padding: '32px', textAlign: 'center' }}>
                <p style={{ color: '#6b7280' }}>No orders yet</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {orders.map((order) => (
                  <div key={order.id} style={{ ...styles.restaurantCard, padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>Order #{order.id}</h3>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '16px',
                        fontSize: '14px',
                        backgroundColor: order.status === 'Pending' ? '#fef3c7' : order.status === 'Preparing' ? '#dbeafe' : '#d1fae5',
                        color: order.status === 'Pending' ? '#92400e' : order.status === 'Preparing' ? '#1e40af' : '#065f46'
                      }}>
                        {order.status}
                      </span>
                    </div>
                    <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>{order.date}</p>
                    <div style={{ marginTop: '8px', marginBottom: '8px' }}>
                      {order.items.map((item, idx) => (
                        <p key={idx} style={{ color: '#374151' }}>{item.name} - ${item.price}</p>
                      ))}
                    </div>
                    <p style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '16px' }}>Total: ${order.total}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Owner Dashboard
  if (currentPage === 'owner-dashboard') {
    return (
      <div style={styles.container}>
        <NavBar />
        <div style={styles.mainContent}>
          <div style={styles.contentContainer}>
            <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '24px' }}>Restaurant Dashboard</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
              <div style={{ ...styles.restaurantCard, padding: '24px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Add Menu Item</h3>
                <div>
                  <input
                    type="text"
                    placeholder="Item Name"
                    value={menuItem.name}
                    onChange={(e) => setMenuItem({ ...menuItem, name: e.target.value })}
                    style={styles.input}
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={menuItem.description}
                    onChange={(e) => setMenuItem({ ...menuItem, description: e.target.value })}
                    style={styles.input}
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={menuItem.price}
                    onChange={(e) => setMenuItem({ ...menuItem, price: e.target.value })}
                    style={styles.input}
                  />
                  <input
                    type="text"
                    placeholder="Category"
                    value={menuItem.category}
                    onChange={(e) => setMenuItem({ ...menuItem, category: e.target.value })}
                    style={styles.input}
                  />
                  <button
                    onClick={addMenuItem}
                    style={{ ...styles.button, marginBottom: 0 }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#ea580c'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#f97316'}
                  >
                    Add Item
                  </button>
                </div>
              </div>
              <div style={{ ...styles.restaurantCard, padding: '24px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Recent Orders</h3>
                <p style={{ color: '#6b7280' }}>No recent orders</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default App;