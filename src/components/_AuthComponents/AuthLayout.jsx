import { Logo } from '@/icon/Icons'
import React from 'react'
import { Button } from '../ui/button'

export const AuthLayout = ({
    title,
    description,
    children,
    authLogo,
}) => {
  return (
    <div className='h-[100vh] flex flex-col items-center gap-4'>
        <header className='w-full flex items-center justify-center md:justify-start p-4 bg-indigo-600 md:bg-white'>
          {/* <Logo /> */}
          <img 
            src='/tiklogs logo_blue.png' 
            className="hidden sm:block w-auto h-8 object-contain shrink-0 md:ml-6" 
            alt="Tiklogs Logo"
          />
          <img 
            src='/tiklogs logo_white.png' 
            className="w-auto h-8 object-contain shrink-0 md:ml-6" 
            alt="Tiklogs Logo"
          />
        </header>
        <section className='h-[80vh] flex flex-col items-center'>
            <div className='flex flex-col items-center  space-y-2 max-w-lg'>
                <div>{authLogo}</div>
                <h1 className='text-3xl max-w-sm font-bold'>{title}</h1>
                <p className='text-base font-normal max-w-md'>{description}</p>
                <div className='space-y-3 py-2 md:w-[500px]'>
                    {children}
                </div>
            </div>
        </section>
        <footer className='w-full flex items-center p-6 h-[10vh]'>
            <div className='w-full flex justify-between'>
                <p className='text-sm font-medium'>©2024 Tiklog</p>
                <p className='text-sm font-medium'>Privacy Policy</p>
            </div>
        </footer>
    </div>
  )
}
