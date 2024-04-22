"use client"

import { useState } from 'react';

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
    inputName: string;
    contents : string[];
    placeholder: string;
    setEditProfile: React.Dispatch<React.SetStateAction<{}>>;
}



export function ComboBox({inputName, contents, placeholder, setEditProfile} : ComboBoxProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
        <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
            <button
              className="w-full text-left text-sm px-2 py-1 bg-pri_bg_card"
            >
            {value
                ? contents.find((content) => content === value)
                : placeholder}
            </button>
        </PopoverTrigger>
        
        <PopoverContent className="w-[200px] p-0" side="bottom">
            <Command>
              <CommandInput placeholder={`Search ${inputName}...`} />
              <CommandEmpty>No {inputName} found.</CommandEmpty>
              <CommandGroup>
                  <CommandList>

                  {contents.map((content, index) => (
                  <CommandItem
                      key={`${content}_${index}`}
                      value={content}
                      onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue)
                      setEditProfile(prevState => ({
                          ...prevState,
                          [inputName]: currentValue
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
