"use client"
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Remove authUser from local storage
    localStorage.removeItem('authUser');
    router.push('/login');
  }, []);

  return (
    <></>
  );
};

export default LogoutPage;
