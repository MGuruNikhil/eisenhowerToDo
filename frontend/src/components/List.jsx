import React, { useEffect, useState } from 'react'
import ListItem from './ListItem';
import { Button } from './ui/button';
import { Plus, Save } from 'lucide-react';
import { Input } from './ui/input';
import { apiUrl } from '@/config';
import axios from 'axios';
import CircularSpinner from './CircularSpinner';
import { Badge } from './ui/badge';
import { useLocation } from 'react-router-dom';
import { closestCenter, DndContext, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card } from './ui/card';

const List = (props) => {

    const token = (localStorage.getItem("token") || '');
    let heading = '';
    let titles = props.titles;
    const [items, setItems] = useState([]);
    useEffect(() => {
        if (titles) {
            const dndArray = titles.map((title, index) => ({ id: index+1, title }));
            setItems(dndArray);
        }
    }, [titles]);
    

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

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setIsLoading(true);
            let oldIndex = items.findIndex(item => item.id === active.id);
            let newIndex = items.findIndex(item => item.id === over.id);
            
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
            oldIndex = oldIndex.toString();
            newIndex = newIndex.toString();

            axios.put(apiUrl + 'todo/moveVertical', {
                path,
                oldIndex,
                newIndex,
            }, {
                headers: {
                    Authorization: token,
                }
            }).then(res => {
                console.log(res.data);
                setItems(arrayMove(items, oldIndex, newIndex));
                setIsLoading(false);
            }).catch(error => {
                setIsLoading(false);
                console.log(error.response.data.message);
            });
        }
    };

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter:sortableKeyboardCoordinates,
        })
    );

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <Card className="relative min-h-[300px] md:min-h-0 overflow-hidden flex flex-col items-center p-4 bg-[#a3a3a3] dark:bg-background border-[#a3a3a3]">
                <div className='flex items-center justify-center text-center gap-2 pb-2'>
                    <p className='font-bold'>{heading}</p>
                    <Badge>{titles ? titles.length : 0}</Badge>
                </div>
                
                <div className='flex flex-col gap-2 overflow-y-auto overflow-x-hidden w-full items-center flex-1'>
                    <SortableContext items={items} strategy={verticalListSortingStrategy}>
                        {items && items.map((item, index) => (
                            <ListItem key={index} index={index} id={item.id} title={item.title} isAdding={isAdding} heading={props.heading} setIsEditing={setIsEditing} setEditIndex={setEditIndex} handleAddItem={handleAddItem} setNewItem={setNewItem} setOldText={setOldText} setForceReload={props.setForceReload} setIsLoading={setIsLoading}/>
                        ))}
                        {((!items) || (items.length == 0)) && 
                            <>No Items.</>
                        }
                    </SortableContext>
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
                {isLoading && <CircularSpinner Width="30px" StrokeWidth="3"/>}
            </Card>
        </DndContext>
    )
}

export default List
