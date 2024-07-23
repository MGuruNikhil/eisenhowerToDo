import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import ListItem from './ListItem';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';

const List = (props) => {

    let heading = '';
    let titles = props.titles;

    switch(props.heading) {
        case 'ui':
            heading = "Urgent & Important";
            break;
        case 'un':
            heading = "Urgent & Not Important";
            break;
        case 'ni':
            heading = "Not Urgent & Important";
            break;
        case 'nn':
            heading = "Not Urgent & Not Important";
            break;
        default:
            heading = "Urgent & Important";
            break;
    }

    return (
        <div className="relative min-h-[300px] md:min-h-0 overflow-hidden flex flex-col items-center p-4 border-solid border-[1px] border-gray-500 rounded-lg">
            <p className='font-bold pb-2'>{heading}</p>
            <div className='flex flex-col gap-2 overflow-y-auto w-full items-center'>
                {titles && titles.map((title, index) => (
                    <ListItem key={index} index={index} title={title} />
                ))}
                {((!titles) || (titles.length == 0)) && 
                    <>No Items.</>
                }
            </div>
            <Button className='absolute bottom-2 right-2'><Plus className='w-4'/></Button>
        </div>
    )
}

export default List
