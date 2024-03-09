"use client";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import {useRouter} from 'next/navigation'
import {useState} from 'react'

const LoginPage = () => {

  // react form hook variables
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // handle routes
  const router = useRouter()
  const [error, setError] = useState<string | null>(null);
  
  // Submit data to NextAuth 
  const onSubmit = handleSubmit(async (data) => {
    console.log(data);

    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false, //not change page
    });

    console.log(res)

    // handle login status
    if (res.error) {
      setError(res.error)
    } else {
      router.push('/dashboard')
    }

  });

  return (
    <div className="h-[calc(100vh-7rem)] flex justify-center items-center">
      <form onSubmit={onSubmit} className="w-1/4">

        

        <h1 className="text-slate-200 font-bold text-4xl mb-4">Login</h1>

        {/* Email */}
        <label htmlFor="email" className="text-slate-500 mb-2 block text-sm">
          Email
        </label>
        <input
          type="email"
          {...register("email", {
            required: {
              value: true,
              message: "Email is required",
            },
          })}
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
          placeholder="user@email.com"
        />
        {errors.email && (
          <span className="text-red-500 text-xs">{errors.email.message}</span>
        )}

        {/* Password */}
        <label htmlFor="password" className="text-slate-500 mb-2 block text-sm">
          Password:
        </label>
        <input
          type="password"
          {...register("password", {
            required: {
              value: true,
              message: "Password is required",
            },
          })}
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
          placeholder="******"
        />
        {errors.password && (
          <span className="text-red-500 text-xs">
            {errors.password.message}
          </span>
        )}

        {/* login button */}
        <button className="w-full bg-blue-500 text-white p-3 rounded-lg mt-2">
          Login
        </button>

        {/* Error Alert */}
        {error && (
          <p className="bg-red-500 text-lg text-white p-3 rounded mt-4">{error}</p>
        )}
      </form>
    </div>
  );
}
export default LoginPage;