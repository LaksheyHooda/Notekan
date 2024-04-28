"use client";
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { useRouter, useSearchParams  } from 'next/navigation';
import { auth, db } from '@/config/firebase/config';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export default function TemplateEditor() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [template, setTemplate] = useState({ userID: '', style: '', description: '' });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
        if (!authUser) {
            router.replace('/login'); 
        } else {
            setUser(authUser);
            if (authUser && id !== 'new') {
                fetchTemplate(id);
            } else if (authUser) {
                setTemplate({ userID: authUser.uid, style: '', description: '' });
                setLoading(false);
            }
        }
        });

        return () => unsubscribe();
    }, []);

    const fetchTemplate = async (templateId) => {
        setLoading(true);
        const templateRef = doc(db, 'Templates', templateId);
        try {
            const docSnap = await getDoc(templateRef);
            if (docSnap.exists()) {
                setTemplate(docSnap.data());
            } else {
                setError('Template does not exist');
            }
        } catch (err) {
            setError(`Error fetching template: ${err.message}`);
        }
        setLoading(false);
    };

    const handleSave = async () => {
        if (template.description.split(' ').length > user.maxWordLimit) {
            setError(`Description exceeds word limit of ${user.maxWordLimit}`);
            return;
        }

        setLoading(true);
        const templateRef = id === 'new' ? doc(db, 'Templates') : doc(db, 'Templates', id);
        try {
            const updatedData = { ...template };
            if (id === 'new') {
                await setDoc(templateRef, updatedData);
                await updateDoc(doc(db, 'users', user.uid), {
                    templatesMade: user.templatesMade + 1
                });
            } else {
                await updateDoc(templateRef, updatedData);
            }
            router.push('/customtemplates'); 
        } catch (err) {
            setError(`Error saving template: ${err.message}`);
        }
        setLoading(false);
    };

    const handleCancel = () => {
        router.push('/template-viewer');
    };

    if (loading) return <div className="text-center mt-4">Loading...</div>;
    if (error) return <div className="text-red-500 text-center mt-4">Error: {error}</div>;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 p-4">
            <input
                type="text"
                value={template.name}
                onChange={(e) => setTemplate({ ...template, name: e.target.value })}
                placeholder="Template Name"
                className="input input-bordered input-primary w-full max-w-xs"
            />
            <textarea
                value={template.description}
                onChange={(e) => setTemplate({ ...template, description: e.target.value })}
                placeholder="Template Description"
                className="textarea textarea-primary w-full mt-2"
            />
            <div className="mt-4 flex space-x-2">
                <button onClick={handleSave} className="btn btn-primary">
                    Save Template
                </button>
                <button onClick={handleCancel} className="btn btn-secondary">
                    Cancel
                </button>
            </div>
        </div>
    );
};