import { ModeToggle } from './mode-toggle'
import { LogOut } from 'lucide-react';
import { Button } from './ui/button';

const NavBar = () => {
    const token = localStorage.getItem("token") || '';

    return (
        <div className='w-full flex items-center justify-between px-4 py-2 sticky bg-inherit backdrop-blur-sm z-10'>
            <div className='flex items-center justify-center gap-2'>
                <img src='/Eisenhower-Matrix.png' width={30} height={30} />
                <h1>EisenHowerToDo</h1>
            </div>
            <div className='flex gap-4 items-center justify-center'>
                {(token && token.length > 0) &&  
                    <Button onClick={ () => { localStorage.removeItem('token'); window.location.reload(); } } variant='outline'>
                        <LogOut/>
                    </Button>
                }
                <ModeToggle />
            </div>
        </div>
    )
}

export default NavBar
