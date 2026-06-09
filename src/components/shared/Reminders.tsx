"use client"

import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
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
        <div className="w-full">
            <h2 className="font-display text-lg font-extrabold text-ink mb-4">Your Reminders</h2>
            <ul className="flex flex-col gap-2.5">
                {remindersArray.length > 0 ? remindersArray.map((reminderItem, index) => {
                    const checking = checkReminders.has(reminderItem.reminder);
                    return (
                    <li className="flex items-center gap-2.5" key={`reminders-${index}`}>
                        <label className="relative inline-flex cursor-pointer">
                            <input
                                type="checkbox"
                                checked={checking}
                                onChange={() => handleCheck(reminderItem.reminder)}
                                className="sr-only"
                            />
                            <span className={`flex_center h-5 w-5 rounded-md border-2 transition ${checking ? 'bg-pri_mint_main border-pri_mint_main' : 'bg-white border-hairline hover:border-pri_mint_main'}`}>
                                {checking && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                            </span>
                        </label>
                        <p className={`text-[15px] transition ${checking ? 'text-pri_navy_light line-through' : 'text-ink'}`}>{reminderItem.reminder}</p>
                    </li>
                    );
                })
                :
                <p className="text-sm italic text-ink_soft">No reminders yet — but here&apos;s one: you&apos;re awesome, keep slaying! ✨</p>
                }
            </ul>
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-hairline bg-canvas p-1.5 transition focus-within:border-pri_mint_main focus-within:ring-2 focus-within:ring-pri_mint_main/30">
                <input
                    type="text"
                    placeholder="e.g. i'll make myself proud tdy"
                    className="min-w-0 flex-1 bg-transparent px-2 py-1.5 text-sm text-ink placeholder:text-pri_navy_light focus:outline-none"
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
                    className="shrink-0 rounded-lg bg-pri_mint_main px-3.5 py-1.5 text-sm font-bold text-white shadow-mint transition hover:bg-pri_mint_dark"
                    onClick={submitReminder}
                >
                    Add
                </button>
            </div>
            {showLimit && <p className="mt-1.5 text-xs text-pri_red_main">30 character limit reached!</p>}
        </div>
    );
};

export default Reminders;
