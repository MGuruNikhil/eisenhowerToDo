import React from 'react'
import { Card } from './ui/card'
import { GripVertical, Pencil, Trash2 } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import slugify from 'slugify'

const ListItem = (props) => {

    const navigate = useNavigate();
    let location = useLocation();
    console.log("we are here : ",location);
    const slug = slugify(props.title);
    const handleClick = () => {
        if(location.pathname == '/') {
            navigate(location.pathname+props.heading+'/'+slug);
        } else {
            navigate(location.pathname+'/'+props.heading+'/'+slug);
        }
    }
    
    return (
        <Card className={`${props.isAdding ? 'hover:z-10' : 'hover:z-20'} p-2 flex gap-2 w-[90%] z-10`}>
            <GripVertical className='opacity-50 w-4 hover:opacity-100 cursor-grab'/>
            <p onClick={ handleClick } className='flex-1 cursor-pointer'>{props.title}</p>
            <Pencil className='opacity-50 w-4 hover:opacity-100 cursor-pointer'/>
            <Trash2 className='opacity-50 w-4 hover:opacity-100 cursor-pointer'/>
        </Card>
    )
}

export default ListItem
