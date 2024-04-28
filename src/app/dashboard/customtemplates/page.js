"use client";
import { doc, getDoc, updateDoc, deleteDoc, arrayRemove, increment } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth, db } from '@/config/firebase/config';

export default function TemplateViewer() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [userID, setUserID] = useState('');
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            if (!authUser) {
                router.replace('/login');
            } else {
                setUser(authUser);
                setUserID(user)
                fetchUserData();
            }
        });

        return () => unsubscribe();
    }, []);
        
    const fetchUserData = async () => {
        setLoading(true);
        const userRef = doc(db, 'users', userID);
        try {
            const docSnap = await getDoc(userRef);
            if (docSnap.exists()) {
                const userData = docSnap.data();
                setTemplates(userData.templates || []);
            } else {
                setError('No user data available.');
            }
        } catch (err) {
            setError(`Error fetching user data: ${err.message}`);
        }
        setLoading(false);
    };

    const handleSelectTemplate = (templateID) => {
        router.push(`editor/?id=${templateID}`);
    };

    const handleAddNewTemplate = () => {
        if (user.templatesMade >= user.maxTemplates) {
            setError('Maximum template limit reached.');
            return;
        }
        router.push(`editor/new`);
    };

    const handleDeleteTemplate = async (templateId) => {
        try {
          const templateRef = doc(db, 'Templates', templateId);
          await deleteDoc(templateRef);
          await updateDoc(doc(db, 'Users', user.uid), {
            customTemplatesMade: increment(-1)
          });
          setTemplates(templates.filter(template => template.id !== templateId));
        } catch (err) {
          setError(`Error deleting template: ${err.message}`);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-cyan-500 to-blue-500 p-4">
          {loading && <div>Loading...</div>}
          {error && <div className="text-red-500">{error}</div>}
          {templates.map(template => (
            <div key={template.id} className="p-4 bg-white rounded shadow-md m-2 flex justify-between items-center">
              <div>
                <div className="font-bold">{template.style}</div>
                <button onClick={() => handleSelectTemplate(template.id)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                  Edit
                </button>
                <button onClick={() => handleDeleteTemplate(template.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                  Delete
                </button>
              </div>
            </div>
          ))}
          <button onClick={handleAddNewTemplate}
            className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Add New Template
          </button>
        </div>
      );
};