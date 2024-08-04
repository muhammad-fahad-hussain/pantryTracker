import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth'; // Import onAuthStateChanged
import PantryItemForm from './PantryItemForm';
import { db, auth } from '../firebaseAuth'; // Ensure `auth` is exported from `firebaseAuth`
import { collection, getDocs, deleteDoc, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import './Dashboard.css';

const Dashboard = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [pantryItems, setPantryItems] = useState([]);
    const [currentItem, setCurrentItem] = useState(null);
    const [user, setUser] = useState(null); // State for user
    const [userName, setUserName] = useState(''); // State for user name
    const navigate = useNavigate(); // Hook to navigate programmatically

    const handleOpenModal = (item = null) => {
        setCurrentItem(item);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setCurrentItem(null);
    };

    const fetchPantryItems = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'pantryItems'));
            const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPantryItems(items);
        } catch (error) {
            console.error("Error fetching pantry items: ", error);
        }
    };

    const fetchUserProfile = async (userId) => {
        try {
            const userDoc = await getDoc(doc(db, 'users', userId));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setUserName(`${userData.firstName} ${userData.lastName}`);
            }
        } catch (error) {
            console.error("Error fetching user profile: ", error);
        }
    };

    const handleFormSubmit = async (item) => {
        try {
            if (item.id) {
                await updateDoc(doc(db, 'pantryItems', item.id), {
                    name: item.name,
                    picture: item.picture
                });
            } else {
                await setDoc(doc(db, 'pantryItems', item.id), item);
            }
            fetchPantryItems();
            handleCloseModal();
        } catch (error) {
            console.error("Error updating/adding item: ", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'pantryItems', id));
            setPantryItems(pantryItems.filter(item => item.id !== id));
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/'); // Redirect to the sign-in page
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user); // Set user state
                fetchPantryItems();
                fetchUserProfile(user.uid); // Fetch user profile
            } else {
                navigate('/'); 
            }
        });

        return () => unsubscribeAuth();
    }, [navigate]);

    return (
        <div className="dashboard">
            <div className="sidebar">
                <h2 className="sidebar-header">{userName}</h2>
                <a href="#home" className="sidebar-link active">Home</a>
                <a onClick={handleLogout} className="sidebar-link">LogOut</a>
            </div>
            <div className="content">
                <header className="header">
                    <h1>Pantry Tracker</h1>
                    {userName && <p>Welcome, {userName}</p>}
                </header>
                <main>
                    <button onClick={() => handleOpenModal()} className="open-modal-btn">Add Pantry Item</button>

                    {modalOpen && (
                        <div className="modal" onClick={handleCloseModal}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <span className="close" onClick={handleCloseModal}>&times;</span>
                                <PantryItemForm
                                    onSubmit={handleFormSubmit}
                                    initialValues={currentItem || {}}
                                />
                            </div>
                        </div>
                    )}

                    <table className="pantry-items-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Picture</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pantryItems.map(item => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>
                                        {item.picture && (
                                            <img src={item.picture} alt={item.name} className="item-picture" />
                                        )}
                                    </td>
                                    <td className="action-buttons">
                                        <button
                                            className="Update"
                                            onClick={() => handleOpenModal(item)}
                                        >
                                            Update
                                        </button>

                                        <button
                                            className="delete"
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
