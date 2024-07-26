import React, { useState } from 'react'
import ListItem from './ListItem';
import { Button } from './ui/button';
import { Plus, Save } from 'lucide-react';
import { Input } from './ui/input';
import { apiUrl, frontEndUrls } from '@/config';
import axios from 'axios';
import CircularSpinner from './CircularSpinner';

const List = (props) => {

    const token = localStorage.getItem("token");
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
    const [newItem, setNewItem] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleAddItem = () => {
        if(!isAdding) {
            setIsAdding(true);
        } else {
            setIsLoading(true);
            let url = window.location.href;

            for(let i=0;i<frontEndUrls.length;i++) {
                url = url.replace(frontEndUrls[i], '');
            }
            
            let points = url.split('/').filter(str => str !== '');
            console.log(points);
        
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
            console.log(path,text);

            axios.post(apiUrl + 'todo', {
                path,
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
                props.setForceReload();
            }).catch(error => {
                setIsLoading(false);
                setNewItem('');
                setIsAdding(false);
                if(error.response.status == 405) {
                    alert("There is already an item with same slug in this box. Duplicates not allowed.");
                }
                console.log(error.response.data.message);
            })
        }
    }

    return (
        <div className="relative min-h-[300px] md:min-h-0 overflow-hidden flex flex-col items-center p-4 border-solid border-[1px] border-gray-500 rounded-lg">
            <p className='font-bold pb-2'>{heading}</p>
            <div className='relative flex flex-col gap-2 overflow-y-auto w-full items-center'>
                {titles && titles.map((title, index) => (
                    <ListItem key={index} index={index} title={title} isAdding={isAdding} heading={props.heading} />
                ))}
                {((!titles) || (titles.length == 0)) && 
                    <>No Items.</>
                }
                {isLoading && <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-inherit backdrop-blur-sm z-10"><CircularSpinner Width="30px" StrokeWidth="3"/></div>}
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
