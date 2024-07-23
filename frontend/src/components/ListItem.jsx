import React from 'react'
import { Card } from './ui/card'
import { GripVertical, Pencil, Trash2 } from 'lucide-react'

const ListItem = (props) => {
    return (
        <Card className='p-2 flex gap-2 w-[90%]'>
            <GripVertical className='opacity-50 w-4 hover:opacity-100 cursor-grab'/>
            <p className='flex-1'>{props.title}</p>
            <Pencil className='opacity-50 w-4 hover:opacity-100 cursor-pointer'/>
            <Trash2 className='opacity-50 w-4 hover:opacity-100 cursor-pointer'/>
        </Card>
    )
}

export default ListItem
