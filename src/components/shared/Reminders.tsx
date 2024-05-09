"use client"

import { useState, useEffect } from 'react';
import { updateRemindersByUserId, getRemindersByUserId } from '@/lib/actions/reminder.action';


const Reminders = ({userId, isOwnUser} : {userId: string, isOwnUser: boolean}) => {
    const initialReminderState = {
        reminder: '',
        setDate: new Date(),
        dueDate: new Date(),
    };

    // const TEST_DATA = [
    //     {
    //         reminder: "Do homework",
    //         setDate: new Date(),
    //         dueDate: new Date(),
    //     },
    //     {
    //         reminder: "Revise",
    //         setDate: new Date(),
    //         dueDate: new Date(),
    //     },
    // ]

    const [remindersArray, setRemindersArray] = useState<ReminderItem[]>([]);


    const [newReminder, setNewReminder] = useState<ReminderItem>(initialReminderState);

    console.log("Render");
    useEffect(()=>{
        console.log("Inside useEffect");
        const getReminder = async () =>{
            try{
                console.log("fetching remindersArray");
                const remindersArrayResult = await getRemindersByUserId({userId});
                console.log("received remindersArray:");
                console.log(remindersArrayResult);
    
                setRemindersArray(remindersArrayResult);
            }
            catch(error){
                console.log(error);
            }
        
        }
        getReminder();

    }, [])

    const submitReminder = async () => {
        if (newReminder.reminder.length > 0){
            
            try{
                await updateRemindersByUserId({userId: userId, remindersArrayNew: [...remindersArray, newReminder as ReminderItem]});
                setRemindersArray(prev => [...prev, newReminder as ReminderItem]);

                setNewReminder(initialReminderState);
            }
            catch(error){
                alert("Failed")
            }
        }
        else{
            alert("No reminder set");
        }
    }

    return (
        <div className="flex_col_center w-full bg-pri_bg_card gap-4">
            <h1 className="font-bold text-pri_navy_main text-center text-lg md:text-xl mb-2">Reminders</h1>

            <ul className="w-full">
                {remindersArray.length > 0 && remindersArray.map((reminderItem, index)=>{
                    return(
                    <li className="flex justify-start items-center mb-2 gap-2" key={`reminders-${index}`}>
                        <label className="inline-block relative cursor-pointer">
                            <input
                                type="checkbox"
                                checked={false}
                                onChange={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    alert("removing reminder");
                                }}
                                className="opacity-0 absolute w-full h-full left-0 top-0 z-10 cursor-pointer"
                            />
                            <span className={`block w-6 h-6 rounded-md border-2 ${false ? 'bg-green-600 border-lime-200' : 'bg-pri_bg_card2 border-pri_bg_card2'}`}></span>
                        </label>
                        <p className="text-pri_navy_main text-sm md:text-md">{reminderItem.reminder}</p>
                    </li>)
                })}
            </ul>
            
            <div className="flex_center gap-2 ">
                <input
                    type="text"
                    placeholder="finish math algebra hmk"
                    className="bg-transparent px-2 py-1"
                    onChange={(e)=>{
                        setNewReminder((prev)=> ({
                            ...prev,
                            reminder: e.target.value,
                            setDate: new Date(),
                            dueDate: new Date(),
                        }))
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            submitReminder();
                        }
                    }}
                    value={newReminder.reminder ? newReminder.reminder : ''}
                />
                

            
                <button
                    type="button"
                    className="cursor-pointer bg-green-200 px-2 py-1 rounded-md"
                    onClick={(e)=>{
                        e.preventDefault();
                        submitReminder();
                    }}
                >
                    + Add
                </button>
            </div>


        </div>
    )
}

export default Reminders
