import React from 'react'

export default function Header() {
    return (
        <header className='flex items-center justify-between gap-4 p-4'>
            
            <a href="/"><h1 className='font-medium'>My<span className='text-blue-400 bold'>Transcribe</span></h1></a>
            <div className='gap-4 flex items-center '>
               
                <a href="https://sicelwesihlemyeza.netlify.app/" target='_blank' className='text-slate-600 cursor-pointer' rel="noreferrer">Made BY</a>
                <a href="/" className='flex items-center gap-2 special-btn px-3 py-2 rounded-lg text-blue-400'>
                    <p>New</p>
                    <i className="i-fa-solid-plus"></i>
                </a>
            </div>
        </header>
    )
}