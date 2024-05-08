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

    const [remindersArrayNew, setRemindersArrayNew] = useState<ReminderItem[]>([]);

    const [newReminder, setNewReminder] = useState<ReminderItem>(initialReminderState);


    
    useEffect(()=>{
    
        const getReminder = async () =>{
            const remindersArray = await getRemindersByUserId(userId);
            
            // only if user has reminders
            if (remindersArray){
                setRemindersArray(remindersArray);
            }
        
        }
        getReminder();

    }, [])

    const submitReminder = async () => {
        if (newReminder.reminder.length > 0){
            setRemindersArrayNew(prev => [...prev, newReminder as ReminderItem]);
            setNewReminder(initialReminderState);
            try{
                await updateRemindersByUserId({userId: userId, remindersArrayNew: remindersArrayNew});
                setRemindersArray(prev => [...prev, newReminder as ReminderItem]);
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
        <div className="flex_col_center bg-pri_bg_card gap-4">
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
                            <span className={`block w-6 h-6 rounded-md border-2 ${status ? 'bg-green-600 border-lime-200' : 'bg-pri_bg_card2 border-pri_bg_card2'}`}></span>
                            {false && (
                                <svg className="absolute top-1 left-1 w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="6" d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </label>
                        <p className="text-pri_navy_main text-sm md:text-md">{reminderItem.reminder}</p>
                    </li>)
                })}
            </ul>
            
            {/* For user to add reminders */}
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
                            e.preventDefault();  // Prevent the default Enter key behavior
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

/* TODO: Add deadline to reminder */
/* <input
    type="date"
    className="bg-transparent p-2 rounded-md focus:outline-none focus:border-blue-500 transition-colors"
    onChange={(e) => {
        setNewReminder((prev) => ({
            ...prev,
            dueDate: new Date(e.target.value)
        }));
    }}
/> */

                
// // Function to handle date selection
// const handleDateChange = (date) => {
//     setNewReminder((prev) => ({
//         ...prev,
//         dueDate: date
//     }));
//     setShowDatePicker(false); // Hide the picker after selection
// };