import React from 'react'
import { Link } from 'react-router-dom'

const ServerError = () => {
    return (
        <div className='flex-1 flex items-center justify-center'>
            <div className='font-bold border-r-solid border-r-2 p-4 text-lg'>500</div>
            <div className='p-4'>Something went wrong. Click <Link className='font-bold text-lg underline' to='/'>here</Link> to go to the home page</div>
        </div>
    )
}

export default ServerError
