'use client'

import Image from "next/image";
import { db, auth } from "@/config/firebase/config";
import { addDoc, collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Modal from "@/components/failedloginmodal";


export default function Signup() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {

    }, []);

    const handleSignup = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
                revalidatePath('/dashboard') // Update cached posts
                redirect('/dashboard');
            })
        } catch (error) {
            setError(error.message);
            setIsModalOpen(true);
        }
    }


    return (
        <div className="flex min-h-screen flex-col items-center p-24">
            Login!
            <form>
                <Input
                    className="mt-4"
                    placeholder="Email"
                    value={email}
                    onValueChange={setEmail}
                />
                <Input
                    className="mt-4"
                    placeholder="Password"
                    type="password"
                    value={password}
                    onValueChange={setPassword}
                />
                <Button className="mt-4" onClick={handleSignup}>
                    Login
                </Button>
            </form>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} message={error} />
        </div>
    );
}
