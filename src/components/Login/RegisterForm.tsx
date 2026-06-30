'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, UserPlus, User, Lock, Mail } from 'lucide-react'
import { useRegister } from '@/hook/useAuth'
import toast from 'react-hot-toast'
import { setAuth } from '@/lib/redux/slices/authSlice';
import { useAppDispatch } from '@/hook/useRedux'

interface RegisterFormData {
  phone: string
  email: string
  password: string
  first_name: string,
  last_name: string
}

export default function RegisterForm({setForm}:{setForm:(form:string)=>void}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [serverError, setServerError] = useState('')
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError
  } = useForm<RegisterFormData>({
    defaultValues: {
      phone: '',
      email: '',
      password: '',
      first_name: '',
      last_name: ''
    }
  })

  const password = watch('password')


  const { mutateAsync: registerMutation, isPending: isRegistering } = useRegister();


  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setServerError('')
    try {
      const response = await registerMutation({...data ,last_name: '-' , first_name:'-'})
      dispatch(setAuth({token:response.data.token,role:response.data.user.role}));
      toast.success('ثبت نام با موفقیت انحام شد.')
    } catch (error:any) {
      toast.error(error.message)
    } finally {
      setIsLoading(isRegistering)
    }
  }

  return (
    <div className="w-full h-screen bg-[url('/loginBg.jpg')] bg-orange-950 font-[sarvenaz] bg-cover bg-center bg-no-repeat">
      <section className='w-full h-full flex justify-center items-center'>
        <form onSubmit={handleSubmit(onSubmit)} className='w-100'>
          <div className='w-full bg-gray-100 rounded-t-2xl p-3'>
            <div className='w-full flex justify-center items-center text-2xl border-b-1 border-black pb-1'>
              <h3>ثبت نام</h3>
            </div>
            <div className='w-full h-full mt-10 px-10'>
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

              {/* Email Field */}
              <div className='w-full mt-10'>
                <div className='relative'>
                  <Mail className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400' size={20} />
                  <input
                    id='email'
                    type="email"
                    {...register('email', {
                      required: 'ایمیل الزامی است',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'ایمیل معتبر نیست'
                      }
                    })}
                    className='w-full border-b-2 border-black outline-0 pr-8 pb-2 text-xl'
                    placeholder='ایمیل'
                  />
                </div>
                {errors.email && (
                  <p className='text-red-500 text-sm mt-1 pr-2'>{errors.email.message}</p>
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
              {serverError && !errors.phone && !errors.email && (
                <p className='text-red-500 text-sm pr-2 mt-4'>{serverError}</p>
              )}

              {/* Login Link */}
              <div className='mt-7 text-right'>
                <span className='text-md text-black'>قبلاً ثبت نام کرده اید؟ </span>
                <button
                  type='button'
                  onClick={() =>{setForm('login')}}
                  className='text-orange-500 hover:text-orange-700 text-md font-semibold transition-colors cursor-pointer'
                >
                  ورود به حساب
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
                <span>در حال ثبت نام...</span>
              </div>
            ) : (
              <>
                <UserPlus className='ml-2' size={24} />
                <span>ثبت نام</span>
              </>
            )}
          </button>
        </form>
      </section>
    </div>
  )
}