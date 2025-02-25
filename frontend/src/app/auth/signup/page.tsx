"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { API_ROUTES } from '@/config/api';

export default function SignUp() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState("entrepreneur");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      console.log('Starting sign-up request...');
      const response = await fetch(API_ROUTES.AUTH.SIGNUP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, email, password, accountType }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        localStorage.setItem('token', data.token);
        const decodedToken = JSON.parse(atob(data.token.split('.')[1]));
        
        if (decodedToken.user.accountType === 'entrepreneur') {
          router.push('/entrepreneur/home');
        } else if (decodedToken.user.accountType === 'investor') {
          router.push('/investor/home');
        }
      } else {
        setError(data.message || 'Sign-up failed');
      }
    } catch (error) {
      console.error('Sign-up error:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2">
          <Image 
            src="/logo.png" 
            alt="StartNet Logo" 
            width={40} 
            height={40}
            className="w-10 h-10"
          />
          <span className="text-2xl font-bold text-foreground">StartNet</span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-foreground">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="block w-full rounded-md border border-border bg-inputBg px-3 py-2 text-foreground placeholder:text-secondaryText focus:border-focus focus:outline-none focus:ring-1 focus:ring-focus"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border border-border bg-inputBg px-3 py-2 text-foreground placeholder:text-secondaryText focus:border-focus focus:outline-none focus:ring-1 focus:ring-focus"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border border-border bg-inputBg px-3 py-2 text-foreground placeholder:text-secondaryText focus:border-focus focus:outline-none focus:ring-1 focus:ring-focus"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div>
              <label htmlFor="accountType" className="block text-sm font-medium text-foreground">
                I am an
              </label>
              <div className="mt-1">
                <select
                  id="accountType"
                  name="accountType"
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                  className="block w-full rounded-md border border-border bg-inputBg px-3 py-2 text-foreground placeholder:text-secondaryText focus:border-focus focus:outline-none focus:ring-1 focus:ring-focus"
                >
                  <option value="entrepreneur">Entrepreneur</option>
                  <option value="investor">Investor</option>
                </select>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-md bg-foreground px-3 py-2 text-sm font-semibold text-background hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoading ? 'Signing up...' : 'Sign up'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="text-center text-sm">
              <span className="text-secondaryText">Already have an account? </span>
              <Link href="/auth/signin" className="font-medium text-foreground hover:underline">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}