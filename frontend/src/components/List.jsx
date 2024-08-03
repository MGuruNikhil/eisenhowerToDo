import React, { useState } from 'react'
import ListItem from './ListItem';
import { Button } from './ui/button';
import { Plus, Save } from 'lucide-react';
import { Input } from './ui/input';
import { apiUrl } from '@/config';
import axios from 'axios';
import CircularSpinner from './CircularSpinner';
import { Badge } from './ui/badge';
import { useLocation } from 'react-router-dom';

const List = (props) => {

    const token = (localStorage.getItem("token") || '');
    let heading = '';
    let titles = props.titles;

    switch(props.heading) {
        case 'iu':
            heading = "Important & Urgent";
            break;
        case 'in':
            heading = "Important & Not Urgent";
            break;
        case 'nu':
            heading = "Not Important & Urgent";
            break;
        case 'nn':
            heading = "Not Important & Not Urgent";
            break;
        default:
            heading = "Important & Urgent";
            break;
    }

    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState("");
    const [oldText, setOldText] = useState("");
    const [newItem, setNewItem] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const url = useLocation().pathname;

    const handleAddItem = () => {
        if(!isAdding) {
            setIsAdding(true);
        } else {
            setIsLoading(true);
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
            let text = newItem;

            if(isEditing) {
                if(oldText == text) {
                    setIsLoading(false);
                    setNewItem('');
                    setIsAdding(false);
                    setIsEditing(false);
                    setEditIndex("");
                    setOldText("");
                    return;
                }
                const index = editIndex;
                axios.put(apiUrl + 'todo', {
                    path,
                    index,
                    text,
                }, {
                    headers: {
                        Authorization: token,
                    }
                }).then(res => {
                    console.log(res.data);
                    setIsLoading(false);
                    setNewItem('');
                    setIsAdding(false);
                    setIsEditing(false);
                    setEditIndex("");
                    setOldText("");
                    props.setForceReload();
                }).catch(error => {
                    setIsLoading(false);
                    setNewItem('');
                    setIsAdding(false);
                    setIsEditing(false);
                    setEditIndex("");
                    setOldText("");
                    if(error.response.status == 405) {
                        alert("There is already an item with same slug in this box. Duplicates not allowed.");
                    }
                    console.log(error.response.data.message);
                });
            } else {
                axios.post(apiUrl + 'todo', {
                    path,
                    text,
                }, {
                    headers: {
                        Authorization: token,
                    }
                }).then(res => {
                    setIsLoading(false);
                    setNewItem('');
                    setIsAdding(false);
                    props.setForceReload();
                }).catch(error => {
                    setIsLoading(false);
                    setNewItem('');
                    setIsAdding(false);
                    if(error.response.status == 405) {
                        alert("There is already an item with same slug in this box. Duplicates not allowed.");
                    }
                    console.log(error.response.data.message);
                });
            }
        }
    }

    return (
        <div className="relative min-h-[300px] md:min-h-0 overflow-hidden flex flex-col items-center p-4 border-solid border-[1px] border-gray-500 rounded-lg">
            <div className='flex items-center justify-center text-center gap-2 pb-2'>
                <p className='font-bold'>{heading}</p>
                <Badge>{titles ? titles.length : 0}</Badge>
            </div>
            <div className='relative flex flex-col gap-2 overflow-y-auto w-full items-center'>
                {titles && titles.map((title, index) => (
                    <ListItem key={index} index={index} title={title} isAdding={isAdding} heading={props.heading} setIsEditing={setIsEditing} setEditIndex={setEditIndex} handleAddItem={handleAddItem} setNewItem={setNewItem} setOldText={setOldText} setForceReload={props.setForceReload} setIsLoading={setIsLoading}/>
                ))}
                {((!titles) || (titles.length == 0)) && 
                    <>No Items.</>
                }
                {isLoading && <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-inherit backdrop-blur-sm z-50"><CircularSpinner Width="30px" StrokeWidth="3"/></div>}
            </div>
            <div className={`absolute bottom-2 left-2 right-2 flex gap-2 items-center justify-end`}>
                <Input 
                    className={`${isAdding ? 'block z-20' : 'hidden'}`}
                    type="text"
                    value={newItem}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleAddItem();
                        }
                    }}
                    onChange={(e) => setNewItem(e.target.value)}
                    id="newItem"
                    placeholder="Enter new task."
                />
                <label onClick={ handleAddItem } className='z-10' htmlFor="newItem"><Button>{isAdding ? <Save className='w-4' /> : <Plus className='w-4'/>}</Button></label>
            </div>
        </div>
    )
}

export default List
