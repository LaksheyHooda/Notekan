"use client";
import { doc, getDocs, updateDoc, deleteDoc, arrayRemove, increment, query, collection, where } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth, db } from '@/config/firebase/config';

export default function TemplateViewer() {
  const router = useRouter();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (!authUser) {
        router.replace('/login');
      } else {
        fetchUserData(authUser.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid) => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "users"),
        where("uid", "==", uid)
      );

      const querySnapshot = await getDocs(q);
      if (querySnapshot.size > 0) {
        const userData = querySnapshot.docs[0].data();
        setLoading(false);
      } else {
        setLoading(false);
        setError('No user data available.');
      }
    } catch (err) {
      setError(`Error fetching user data: ${err.message}`);
      setLoading(false);
    }
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