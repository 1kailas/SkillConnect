import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import useAuthStore from '../../store/authStore';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const result = await login(data);
      const dashboardRoute = result.role === 'worker'
        ? '/dashboard/worker'
        : result.role === 'employer'
        ? '/dashboard/employer'
        : '/dashboard/admin';
      navigate(dashboardRoute);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="p-8 md:p-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-heading font-bold text-slate-900 mb-2">
          Welcome Back
        </h2>
        <p className="text-slate-500">Sign in to continue to your dashboard</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email */}
        <div>
          <label className="label">Email Address</label>
          <div className="relative">
            <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              className="input pl-12"
              placeholder="your@email.com"
            />
          </div>
          {errors.email && (
            <p className="text-rose-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="label">Password</label>
          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              {...register('password', {
                required: 'Password is required',
              })}
              className="input pl-12"
              placeholder="Enter your password"
            />
          </div>
          {errors.password && (
            <p className="text-rose-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Forgot Password */}
        <div className="text-right">
          <Link
            to="/auth/forgot-password"
            className="text-primary-600 hover:text-primary-700 text-sm font-semibold transition-colors"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full"
        >
          {isLoading ? (
            <div className="spinner border-white"></div>
          ) : (
            <>
              Login
              <FiArrowRight />
            </>
          )}
        </button>
      </form>

      {/* Sign Up Link */}
      <div className="mt-6 text-center">
        <p className="text-slate-600">
          Don't have an account?{' '}
          <Link
            to="/auth/signup"
            className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
          >
            Sign Up
          </Link>
        </p>
      </div>

      {/* Back to Home */}
      <div className="mt-4 text-center">
        <Link
          to="/"
          className="text-slate-400 hover:text-slate-600 text-sm transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Login;
