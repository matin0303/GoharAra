'use client'
import React, { useState } from 'react'
import LoginForm from '@/components/Login/LoginForm'
import RegisterForm from '@/components/Login/RegisterForm'


export default function LoginPage() {
  const [form , setForm] = useState('login')
  return (
    <div className="w-full h-screen bg-[url('/loginBg.jpg')] bg-orange-950 font-[sarvenaz] bg-cover bg-center bg-no-repeat ">
      <section className='w-full h-full flex justify-center items-center'>
        {form === 'login' ?<LoginForm setForm={setForm}/> : <RegisterForm setForm={setForm}/>}
      </section>
    </div>
  )
}