import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../app/store';
import { login } from '../features/auth/authSlice';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginForm = z.infer<typeof schema>;

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(schema) });

  const onSubmit = (data: LoginForm) => {
    dispatch(login(data));
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Login</h2>

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

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 w-full">
          Login
        </button>
      </form>
    </div>
  );
}
