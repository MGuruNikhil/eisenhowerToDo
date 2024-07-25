import React from 'react'
import { Link } from 'react-router-dom'

const PageNotFound = () => {
    return (
        <div className='flex-1 flex items-center justify-center'>
            <div className='font-bold border-r-solid border-r-2 p-4 text-lg'>404</div>
            <div className='p-4'>The task or page you are trying to find doesn't exist. Click <Link className='font-bold text-lg underline' to='/'>here</Link> to go to the home page</div>
        </div>
    )
}

export default PageNotFound
