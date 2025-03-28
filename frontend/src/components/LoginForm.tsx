import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import styles from './login.module.css';

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const LoginForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState({ text: '', isError: false });

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(loginSchema)
  });

  // Add useEffect to handle message timeout
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: '', isError: false });
      }, 3000); // Message will disappear after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [message.text]);

  const onSubmit = async (data: any) => {
    try {
      const endpoint = isLogin ? '/login' : '/register';
      const response = await fetch(`http://localhost:5001/api/auth${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage({ 
          text: result.message || 'No user found with these credentials', 
          isError: true 
        });
        throw new Error(result.message || 'Authentication failed');
      }

      console.log('API Response:', result);  // Log the API response
      console.log('Form data before reset:', data);  // Log form data before reset

      setMessage({ 
        text: isLogin ? 'Successfully logged in!' : 'Registration successful!', 
        isError: false 
      });
      localStorage.setItem('token', result.token);
      reset();
      
      console.log('Form reset completed');  // Log after form reset
      
    } catch (error) {
      console.error(`${isLogin ? 'Login' : 'Registration'} failed:`, error);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.title}>Welcome back!</h1>
      {message.text && (
        <div className={message.isError ? styles.errorMessage : styles.successMessage}>
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register('email')}
          placeholder="UID"
          type="email"
          className={styles.input}
        />
        {errors.email && <p className={styles.error}>{errors.email.message as string}</p>}
        
        <input
          {...register('password')}
          placeholder="Password"
          type="password"
          className={styles.input}
        />
        {errors.password && <p className={styles.error}>{errors.password.message as string}</p>}

        <button type="submit" className={styles.button}>
          {isLogin ? 'Login' : 'Register'}
        </button>
        
        <div className={styles.switchMode}>
          <span 
            onClick={() => setIsLogin(!isLogin)} 
            className={styles.switchText}
          >
            {isLogin ? 'Need to register?' : 'Already have an account?'}
          </span>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;