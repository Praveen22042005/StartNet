"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { API_ROUTES } from '@/config/api';
import { 
  FaRocket, 
  FaChartLine, 
  FaMoneyBillWave,
  FaLightbulb,
  FaBriefcase,
  FaHandshake,
  FaPiggyBank,
  FaChartBar,
  FaCoffee,
  FaLaptopCode,
  FaBusinessTime,
  FaSeedling
} from 'react-icons/fa';

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('Starting sign-in request to:', API_ROUTES.AUTH.SIGNIN);
      const response = await fetch(API_ROUTES.AUTH.SIGNIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        const decodedToken = JSON.parse(atob(data.token.split('.')[1]));
        console.log('Decoded token:', decodedToken);
        
        if (decodedToken.user.accountType === 'entrepreneur') {
          router.push('/entrepreneur/home');
        } else if (decodedToken.user.accountType === 'investor') {
          router.push('/investor/home');
        } else {
          setError('Invalid account type');
        }
      } else {
        setError(data.message || 'Sign-in failed');
      }
    } catch (error) {
      console.error('Sign-in error:', error);
      setError('Failed to connect to the server. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const DoodleBackground = () => {
    const [doodleData, setDoodleData] = useState(() => {
      // Initialize on the client side
      return Array(50).fill(null).map(() => ({
        rotate: Math.random() * 360,
        duration: Math.random() * 10 + 20,
        iconIndex: Math.floor(Math.random() * 12),
      }));
    });

    useEffect(() => {
      // Ensure the state is initialized only once on the client side
      if (doodleData[0] === null) {
        setDoodleData(Array(50).fill(null).map(() => ({
          rotate: Math.random() * 360,
          duration: Math.random() * 10 + 20,
          iconIndex: Math.floor(Math.random() * 12),
        })));
      }
    }, []);

    const icons = [
      <FaRocket key="rocket" className="w-12 h-12 transform rotate-45" />,
      <FaChartLine key="chart" className="w-12 h-12" />,
      <FaMoneyBillWave key="money" className="w-12 h-12" />,
      <FaLightbulb key="idea" className="w-12 h-12" />,
      <FaBriefcase key="business" className="w-12 h-12" />,
      <FaHandshake key="partnership" className="w-12 h-12" />,
      <FaPiggyBank key="savings" className="w-12 h-12" />,
      <FaChartBar key="stats" className="w-12 h-12" />,
      <FaCoffee key="coffee" className="w-12 h-12" />,
      <FaLaptopCode key="tech" className="w-12 h-12" />,
      <FaBusinessTime key="time" className="w-12 h-12" />,
      <FaSeedling key="growth" className="w-12 h-12" />
    ];

    return (
      <div className="fixed inset-0 z-0 opacity-[0.03]">
        <div className="absolute inset-0 flex flex-wrap gap-20 p-8">
          {doodleData.map((data, i) => (
            <div
              key={i}
              className="transform animate-float"
              style={{
                transform: `rotate(${data.rotate}deg)`,
                animationDuration: `${data.duration}s`,
              }}
            >
              {icons[data.iconIndex]}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <DoodleBackground />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
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
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/90 backdrop-blur-sm py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}
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
                  className="block w-full rounded-md border border-border bg-white/50 px-3 py-2 text-foreground placeholder:text-secondaryText focus:border-focus focus:outline-none focus:ring-1 focus:ring-focus"
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
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border border-border bg-white/50 px-3 py-2 text-foreground placeholder:text-secondaryText focus:border-focus focus:outline-none focus:ring-1 focus:ring-focus"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-md bg-foreground px-3 py-2 text-sm font-semibold text-background hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 disabled:opacity-50 transition-all duration-200"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="text-center text-sm">
              <span className="text-secondaryText">Don&apos;t have an account? </span>
              <Link href="/auth/signup" className="font-medium text-foreground hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}