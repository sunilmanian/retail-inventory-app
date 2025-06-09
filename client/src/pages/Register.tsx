import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type RegisterForm = z.infer<typeof schema>;

export default function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: RegisterForm) => {
    try {
      await axios.post('/api/auth/register', data);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Register</h2>
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

        <input
          {...register('email')}
          placeholder="Email"
          className="w-full mb-2 p-2 border"
        />
        {errors.email && <p className="text-red-600 text-sm mb-2">{errors.email.message}</p>}

        <input
          type="password"
          {...register('password')}
          placeholder="Password"
          className="w-full mb-2 p-2 border"
        />
        {errors.password && <p className="text-red-600 text-sm mb-2">{errors.password.message}</p>}

        <button type="submit" className="bg-green-600 text-white px-4 py-2 w-full">
          Register
        </button>
      </form>
    </div>
  );
}
