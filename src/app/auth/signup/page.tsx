"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../../styles/userPage.css';
import { Exo } from 'next/font/google';
import { signIn } from 'next-auth/react';

const exo = Exo({ subsets: ['latin'], weight: ['400', '700'] });

const Signup: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(''); // Reset error before new action

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.message);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [submitted, router]);

  return (
    <main className={`${exo.className}`}>
      <h1 className='contextTitle'>Europe University Information</h1>
      <p className='context'>Sign up to save important information, choose a country, learn more, and interact with others!</p>
      <div className='container'>
        {submitted ? (
          <div className='sucessfulForm'>
            <h1>Signup Successful!</h1>
            <p>Redirecting to login page...</p>
          </div>
        ) : (
          <div className="containerForm">
            <h1 className='titleForm'>SIGN UP</h1>
            <form className='form' onSubmit={handleSignup}>
              <div className='inputsContainer'>
                <input className='inputFormEmail'
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input className='inputFormPassword'
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button className='inputFormSubmit' type="submit">Signup</button>
            </form>
            <button onClick={() => signIn('google')} className="googleSignInButton">Sign Up with Google</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>
        )}
      </div>
    </main>
  );
};

export default Signup;
