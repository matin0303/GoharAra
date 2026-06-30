'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, LogIn, User, Lock } from 'lucide-react'
import { useLogin } from '@/hook/useAuth'
import toast, { Toaster } from 'react-hot-toast'
import { setAuth } from '@/lib/redux/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@/hook/useRedux'

interface LoginFormData {
  phone: string
  password: string
}
export default function LoginForm({setForm}:{setForm:(form:string)=>void}) {
  const dispatch = useAppDispatch();
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')
  const { mutateAsync: login, isPending: isLogining } = useLogin();


  const {register, handleSubmit,formState: { errors }, setError} = useForm<LoginFormData>({defaultValues: { phone: '', password: ''}})

  const onSubmit = async (data: LoginFormData, e: any) => {
    setIsLoading(true)
    setServerError('')

    try {
      const response = await login(data ,{onSuccess(){
        router.push(redirectTo)
        router.refresh()
        // window.location.href = redirectTo
      }})
      dispatch(setAuth({token:response.data.token,role:response.data.user.role}));
      toast.success('ورود به حساب باموفقیت انجام شد . ')
    } catch (error:any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }

  }
  return (
      <form onSubmit={handleSubmit(onSubmit)} className='w-100 max-sm:mx-2'>
        <div className='w-full  bg-gray-100 rounded-t-2xl p-3 max-sm:p-1'>
          <div className='w-full flex justify-center items-center text-2xl border-b-1 border-black pb-1'>
            <h3>ورود به حساب</h3>
          </div>
          <div className='w-full h-full mt-10 px-10 max-sm:px-2'>
            {/* Username Field */}
            <div className='w-full'>
              <div className='relative'>
                <User className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400' size={20} />
                <input
                  id='phone'
                  type="tel"
                  placeholder="شماره تلفن"
                  dir="ltr"
                  {...register('phone', {
                    required: 'شماره تلفن الزامی است',
                    pattern: {
                      value: /^09[0-9]{9}$/,
                      message: 'شماره تلفن باید ۱۱ رقم و با ۰۹ شروع شود'
                    },
                    onChange: (e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, '');
                    }
                  })}
                  className='w-full border-b-2 border-black outline-0 pr-8 pb-2 text-xl text-right'
                />
              </div>
              {errors.phone && (
                <p className='text-red-500 text-sm mt-1 pr-2'>{errors.phone.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className='w-full mt-10'>
              <div className='relative'>
                <Lock className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400' size={20} />
                <input
                  id='password'
                  type={showPassword ? "text" : "password"}
                  {...register('password', {
                    required: 'رمز عبور الزامی است',
                    minLength: {
                      value: 6,
                      message: 'رمز عبور باید حداقل ۶ کاراکتر باشد'
                    },
                    maxLength: {
                      value: 100,
                      message: 'رمز عبور باید حداکثر ۱۰۰ کاراکتر باشد'
                    },
                    pattern: {
                      value: /^\S+$/,
                      message: 'رمز عبور نمی‌تواند شامل فاصله باشد'
                    }
                  })}
                  className='w-full border-b-2 border-black outline-0 pr-8 pb-2 text-xl'
                  placeholder='رمز عبور'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className='text-red-500 text-sm mt-1 pr-2'>{errors.password.message}</p>
              )}
            </div>

            {/* Server Error Message */}
            {serverError && !errors.phone && (
              <p className='text-red-500 text-sm pr-2'>{serverError}</p>
            )}


            <div className='my-7 text-right'>
              <span className='text-md text-black'>حساب کاربری ندارید؟ </span>
              <button
                type='button'
                onClick={()=>{setForm('Register')}}
                className='text-orange-500 hover:text-orange-700 text-md font-semibold transition-colors  cursor-pointer'
              >
                ثبت نام کنید
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type='submit'
          disabled={isLoading}
          className='h-15 w-full bg-black text-white hover:bg-gray-100 hover:text-black cursor-pointer duration-300 text-xl flex justify-center items-center mt-2 rounded-b-2xl disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isLoading ? (
            <div className='flex items-center gap-2'>
              <div className='w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin'></div>
              <span>در حال ورود...</span>
            </div>
          ) : (
            <>
              <LogIn className='ml-2' size={24} />
              <span>ورود</span>
            </>
          )}
        </button>


      </form>
  )
}
