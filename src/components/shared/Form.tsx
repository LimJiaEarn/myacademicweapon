"use client"

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


type FormProps = {

    fieldsConfig: FormFieldConfig[];
    handleSubmit: (formData: {[key:string]:string}) => void;
    apiUrl?: string; // for API calls if necessary

}




const Form = ({ fieldsConfig, handleSubmit, apiUrl } : FormProps) => {

    // initialise as empty dictionary which stores the formData
    const [formData, setFormData] = useState<{[key : string]:string}>({}); 

    // this helps to track the select and render correct placeholders when user click Clear filter
    const [selectValues, setSelectValues] = useState<{[key:string]:string}>({});
    const CLEAR_FILTER_VALUE = "CLEAR_FILTER";

    
    const onFormSubmit = async (e : React.FormEvent) => {
        
        e.preventDefault();

        handleSubmit(formData); // function created by caller

    }

    const handleSelectChange = (key: string, value: string) => {

        if (value === CLEAR_FILTER_VALUE){
            setSelectValues(prevValues => ({
                ...prevValues,
                [key]: ''
            }));
        }
        else{
            setSelectValues(prevValues => ({
                ...prevValues,
                [key]: value
            }));
            setFormData((prevData) => ({
                ...prevData,
                [key]:value
            }))
        }
        
    };

    return (
        <div className="flex_col_center">

            <form className="flex_col_center gap-4" onSubmit={onFormSubmit}>
                
                
            {fieldsConfig.map((currentField, index) => {

                const fieldKey = currentField.id;
                const selectValue = selectValues[fieldKey] || '';

                return currentField.type === "select" ? (
                    <div key={fieldKey} className="flex_col_center gap-2">

                        <p className="font-semibold">{currentField.title}</p>

                        <Select
                            onValueChange={(value) => handleSelectChange(fieldKey, value)}
                            value={selectValue}
                        >
                            
                            <SelectTrigger className="w-[240px] bg-slate-400">
                                <SelectValue placeholder={currentField.placeholder} />
                            </SelectTrigger>

                            <SelectContent className="w-[240px] bg-slate-300 flex_col_center gap-2">
                                {currentField.options?.map((option, index) => (
                                    <SelectItem className="hover:cursor-pointer" key={option+index} value={option}>{option}</SelectItem>
                                ))}
                                <SelectItem value={CLEAR_FILTER_VALUE} className="text-red-500 hover:cursor-pointer">Clear</SelectItem>

                            </SelectContent>

                        </Select>
                    </div>
                ) :
                (
                    <div key={currentField.title + index} className="flex_col_center gap-2">

                        <p className="font-semibold">{currentField.title}</p>

                        <input
                            type={currentField.type}
                            placeholder={currentField.placeholder || ''}
                            onChange={(e) => {
                                setFormData((prevData) => ({
                                    ...prevData,
                                    [currentField.id]:e.target.value
                                }))
                            }}
                        />

                    </div>
                );
            })}
                


                <button type="submit" className="bg-green-300 hover:bg-green-200 rounded-xl px-4 py-2">Submit</button>

            </form>
        </div>
    )
}

export default Form