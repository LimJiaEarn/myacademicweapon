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
        setRemindersArray(filteredReminders);
    
        setTimeout(async () => {
            try {
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
        }, 500);
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
    };

    return (
        <div className="flex_col_center w-full gap-4">
            <h1 className="font-bold text-pri_navy_main text-center text-lg md:text-xl mb-2">Reminders</h1>
            <ul className="w-full">
                {remindersArray.length > 0 && remindersArray.map((reminderItem, index) => (
                    <li className="flex justify-start items-center mb-2 gap-2" key={`reminders-${index}`}>
                        <label className="inline-block relative cursor-pointer">
                            <input
                                type="checkbox"
                                checked={checkReminders.has(reminderItem.reminder)}
                                onChange={() => handleCheck(reminderItem.reminder)}
                                className="opacity-0 absolute w-full h-full left-0 top-0 z-10 cursor-pointer"
                            />
                            <span className={`block w-6 h-6 rounded-md border-2 ${checkReminders.has(reminderItem.reminder) ? 'bg-green-600 border-lime-200' : 'bg-pri_bg_card2 border-pri_bg_card2'}`}></span>
                            {checkReminders.has(reminderItem.reminder) && (
                                <svg className="absolute top-1 left-1 w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="6" d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </label>
                        <p className="text-pri_navy_main text-sm md:text-md">{reminderItem.reminder}</p>
                    </li>
                ))}
            </ul>
            <div className="flex_center gap-2 ">
                <input
                    type="text"
                    placeholder="finish math algebra hmk"
                    className="bg-transparent px-2 py-1"
                    onChange={(e) => setNewReminder(prev => ({
                        ...prev,
                        reminder: e.target.value,
                        setDate: new Date(),
                        dueDate: new Date(),
                    }))}
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
                    className="cursor-pointer bg-green-200 px-2 py-1 rounded-md"
                    onClick={submitReminder}
                >
                    + Add
                </button>
            </div>
        </div>
    );
};

export default Reminders;
