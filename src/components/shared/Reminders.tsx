"use client"

import { useState, useEffect } from 'react';
import { updateRemindersByUserId, getRemindersByUserId } from '@/lib/actions/reminder.action';

const Reminders = ({ userId }: { userId: string}) => {
    const initialReminderState = {
        reminder: '',
        setDate: new Date(),
        dueDate: new Date(),
    };


    const [remindersArray, setRemindersArray] = useState<ReminderItem[]>([]);
    const [newReminder, setNewReminder] = useState<ReminderItem>(initialReminderState);
    const [checkReminders, setCheckReminders] = useState<Set<string>>(new Set());

    const [showLimit, setShowLimit] = useState(false);

    useEffect(() => {
        const getReminder = async () => {
            try {
                const remindersArrayResult = await getRemindersByUserId({ userId });
                setRemindersArray(remindersArrayResult);
            } catch (error) {
                console.log(error);
            }
        };
        getReminder();
    }, [userId]);

    const handleCheck = (checkedReminder: string) => {
        const filteredReminders = remindersArray.filter(item => item.reminder !== checkedReminder);
    
        setCheckReminders(new Set([...checkReminders, checkedReminder]));
    
        setTimeout(async () => {
            try {
                setRemindersArray(filteredReminders);
                await updateRemindersByUserId({ userId, remindersArrayNew: filteredReminders });
                setCheckReminders(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(checkedReminder);
                    return newSet;
                });
            } catch (error) {
                if (error instanceof Error){
                    alert(error.message);
                }
                // Rollback the UI to previous state
                setRemindersArray(prev => [...prev, { reminder: checkedReminder, setDate: new Date(), dueDate: new Date() }]);
                setCheckReminders(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(checkedReminder);
                    return newSet;
                });
            }
        }, 700);
    };
    

    const submitReminder = async () => {
        if (newReminder.reminder.length > 0) {
            try {
                await updateRemindersByUserId({ userId, remindersArrayNew: [...remindersArray, newReminder] });
                setRemindersArray(prev => [...prev, newReminder]);
                setNewReminder(initialReminderState);
            } catch (error) {
                alert("Failed");
            }
        } else {
            alert("No reminder set");
        }
        setShowLimit(false);
    };

    return (
        <div className="flex_col_center w-full gap-4 px-2">
            <h1 className="text-lg font-bold md:text-md text-pri_navy_dark text-center w-full">Your Reminders</h1>
            <ul className="w-full mr-auto">
                {remindersArray.length > 0 ? remindersArray.map((reminderItem, index) => (
                    <li className="flex justify-start items-center mb-2 gap-2" key={`reminders-${index}`}>
                        <label className="inline-block relative cursor-pointer">
                            <input
                                type="checkbox" 
                                checked={checkReminders.has(reminderItem.reminder)}
                                onChange={() => handleCheck(reminderItem.reminder)}
                                className="opacity-0 absolute w-full h-full left-0 top-0 z-10 cursor-pointer"
                            />
                            <span className={`block w-5 h-5 rounded-md border-2 ${checkReminders.has(reminderItem.reminder) ? 'bg-green-600 border-lime-200' : 'bg-pri_bg_card2 border-pri_bg_card2'}`}></span>
                            {checkReminders.has(reminderItem.reminder) && (
                                <svg className="absolute top-1 left-1 w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="6" d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </label>
                        <p className="text-pri_navy_main text-base">{reminderItem.reminder}</p>
                    </li>
                ))
                :
                <p className="text-sm text-center text-slate-500">You have no reminders. But here's a reminder you're awesome, keep slaying!</p>
                }
            </ul>
            <div className="flex justify-start items-center w-full gap-2 bg-pri_mint_main/60 hover:bg-pri_mint_main/70 rounded-lg shadow-md">
                <input
                    type="text"
                    placeholder="eg. i'll make myself proud tdy"
                    className="bg-transparent flex-grow text-slate-100 placeholder:text-slate-100 px-2 py-1 focus:outline-none"
                    onChange={(e) =>{
                        if (e.target.value.length > 30){
                            setShowLimit(true);
                            return;
                        }
                        else setShowLimit(false);
                        setNewReminder(prev => ({
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
                    value={newReminder.reminder}
                />
                <button
                    type="button"
                    className="cursor-pointer bg-pri_mint_main hover:bg-pri_mint_dark text-slate-100 text-base font-medium h-full px-2 rounded-r-lg"
                    onClick={submitReminder}
                >
                    + Add
                </button>
            </div>
            {showLimit && <p className="text-sm text-red-500 ml-2">30 character limit reached!</p>}
        </div>
    );
};

export default Reminders;
