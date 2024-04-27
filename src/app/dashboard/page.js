'use client'

import { useEffect, useState } from "react";

export default function Signup() {

    useEffect(() => {

    }, []);

    const handleSignup = async () => {
        await signup();
    }


    return (
        <div className="flex min-h-screen flex-col items-center p-24">
            Dashboard
        </div>
    );
}
