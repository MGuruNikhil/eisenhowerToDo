import React from 'react'
import { Card } from './ui/card'
import { GripVertical, Pencil, Trash2 } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import slugify from 'slugify'
import axios from 'axios'
import { apiUrl } from '@/config'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const ListItem = (props) => {

    const token = (localStorage.getItem("token") || '');
    const navigate = useNavigate();
    let url = useLocation().pathname;
    const slug = slugify(props.title);
    const handleClick = () => {
        if(url == '/') {
            navigate(url+props.heading+'/'+slug);
        } else {
            navigate(url+'/'+props.heading+'/'+slug);
        }
    }

    const handleEdit = () => {
        if(!props.isAdding) {
            props.setIsEditing(true);
            props.setEditIndex(props.index.toString());
            props.setOldText(props.title);
            props.setNewItem(props.title);
            props.handleAddItem();
        }
    }

    const handleDelete = () => {
        props.setIsLoading(true);

        let points = url.split('/').filter(str => str !== '');        
        let path = '';
    
        if(points.length != 0) {
            if(points.length % 2 == 0) {
                for(let i=0;i<points.length;i++) {
                    path += points[i];
                    if(i%2==0) {
                        path += '/';
                    } else {
                        path += '~';
                    }
                }
            }
        }

        path += props.heading;
        let index = props.index.toString();

        axios.delete(apiUrl + 'todo', {
            headers: {
                Authorization: token,
            },
            data: {
                path,
                index,
            }
        }).then(res => {
            console.log(res.data);
            props.setIsLoading(false);
            props.setForceReload();
        }).catch(error => {
            props.setIsLoading(false);
            console.log(error.response.data.message);
        });
    }

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    
    return (
        <Card ref={setNodeRef} style={style} {...attributes} className={`${props.isAdding ? 'hover:z-10' : 'hover:z-20'} p-2 flex gap-2 w-[90%] z-10 touch-none`}>
            <GripVertical {...listeners} className='opacity-50 w-4 hover:opacity-100 cursor-grab active:cursor-grabbing' />
            <p onClick={ handleClick } className='flex-1 cursor-pointer hover:underline overflow-scroll'>{props.title}</p>
            <Pencil onClick={ handleEdit } className='opacity-50 w-4 hover:opacity-100 cursor-pointer'/>
            <Trash2 onClick={ handleDelete } className='opacity-50 w-4 hover:opacity-100 cursor-pointer'/>
        </Card>
    )
}

export default ListItem
