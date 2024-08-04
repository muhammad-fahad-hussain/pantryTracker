import React, { useState, useEffect } from 'react';
import { collection, setDoc, doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../firebaseAuth';
import './PantryItemForm.css'; // Import the CSS file for additional styles

const PantryItemForm = ({ onSubmit, initialValues = {} }) => {
    const [name, setName] = useState(initialValues.name || '');
    const [picture, setPicture] = useState(initialValues.picture || '');
    const [file, setFile] = useState(null);
    
    const storage = getStorage(); // Initialize Firebase Storage

    useEffect(() => {
        setName(initialValues.name || '');
        setPicture(initialValues.picture || '');
    }, [initialValues]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let pictureUrl = picture;

        if (file) {
            try {
                const storageRef = ref(storage, `pantryItems/${Date.now()}_${file.name}`);
                await uploadBytes(storageRef, file);
                pictureUrl = await getDownloadURL(storageRef);
            } catch (error) {
                console.error("Error uploading image: ", error);
            }
        }

        const item = {
            id: initialValues.id || Date.now().toString(),
            name,
            picture: pictureUrl
        };

        try {
            if (initialValues.id) {
                // Update existing item
                await updateDoc(doc(db, 'pantryItems', item.id), item);
            } else {
                // Add new item
                await setDoc(doc(db, 'pantryItems', item.id), item);
            }
            onSubmit(item);
        } catch (error) {
            console.error("Error adding/updating item: ", error);
        }
    };

    const handlePictureChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPicture(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Name</label>
                <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                />
            </div>
            <div className="form-group">
                <label>Picture</label>
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handlePictureChange} 
                />
                {picture && <img src={picture} alt="Pantry Item" className="preview-img" />}
            </div>
            <button type="submit">{initialValues.id ? 'Update' : 'Add'}</button>
        </form>
    );
};

export default PantryItemForm;
