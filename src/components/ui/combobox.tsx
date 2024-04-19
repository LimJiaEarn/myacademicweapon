"use client"

import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from 'react';

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";



interface ComboBoxProps {
    contents : string[];
    placeholder: string;
    setProfile: React.Dispatch<React.SetStateAction<{}>>;
}



export function ComboBox({contents, placeholder, setProfile} : ComboBoxProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
        <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
            <button
            className="w-[250px]"
            >
            {value
                ? contents.find((content) => content === value)
                : placeholder}
            </button>
        </PopoverTrigger>
        
        <PopoverContent className="w-[200px] p-0" side="bottom">
            <Command>
            <CommandInput placeholder="Search schools..." />
            <CommandEmpty>No school found.</CommandEmpty>
            <CommandGroup>
                <CommandList>

                {contents.map((content) => (
                <CommandItem
                    key={content}
                    value={content}
                    onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setProfile(prevState => ({
                        ...prevState,
                        ['school']: currentValue
                      }));
                    setOpen(false)
                    }}
                >

                    {content}
                </CommandItem>
                ))}
                </CommandList>
            </CommandGroup>
            </Command>
        </PopoverContent>
        </Popover>

  )
}