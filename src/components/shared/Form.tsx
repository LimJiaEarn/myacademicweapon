// Use Client Directive
"use client"

import { useState } from "react";

// Import your custom Select component and its subcomponents
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Type definition for your form fields
type FormFieldConfig = {
  id: string;
  type: string;
  title: string;
  placeholder?: string;
  options?: string[]; // Only for select fields
  styles?: string; // Custom styles
};

// Props for the Form component
type FormProps = {
  fieldsConfig: FormFieldConfig[];
  handleSubmit: (formData: { [key: string]: string }) => void;
  apiUrl?: string; // Optional, for API calls if necessary
  customStyles?: string; // Optional, for custom styles
};

const Form = ({ fieldsConfig, handleSubmit, apiUrl, customStyles }: FormProps) => {
  const [formData, setFormData] = useState<{ [key: string]: string }>({}); // Initialize as an empty dictionary for form data
  const [selectValues, setSelectValues] = useState<{ [key: string]: string }>({}); // To track the select values
  const CLEAR_FILTER_VALUE = "CLEAR_FILTER"; // Value to clear the select filters

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(formData); // Call the provided handleSubmit function with the form data
  };

  const handleSelectChange = (key: string, value: string) => {
    const newSelectValues = value === CLEAR_FILTER_VALUE ? '' : value;
    setSelectValues(prevValues => ({ ...prevValues, [key]: newSelectValues }));
    setFormData(prevData => ({ ...prevData, [key]: newSelectValues }));
  };

  return (
    <div className="flex_col_center">
      <form className="flex_col_center gap-4 bg-pri_bg_color p-6 rounded-lg shadow-md" onSubmit={onFormSubmit}>
        {fieldsConfig.map((currentField) => {
          const fieldKey = currentField.id;
          const selectValue = selectValues[fieldKey] || '';

          if (currentField.type === "select") {
            return (
              <div key={fieldKey} className="flex_col_center gap-2 w-full">
                <p className="font-semibold text-dark_info_blue w-full text-center">{currentField.title}</p>

                <Select
                  onValueChange={(value) => handleSelectChange(fieldKey, value)}
                  value={selectValue}
                >
                  <SelectTrigger className={`${customStyles || ''}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="w-full bg-light_gray flex_col_center gap-2">
                    {currentField.options?.map((option, idx) => (
                      <SelectItem className="hover:cursor-pointer" key={`${option}-${idx}`} value={option}>{option}</SelectItem>
                    ))}
                    <SelectItem value={CLEAR_FILTER_VALUE} className="text-red-500 hover:cursor-pointer">Clear</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            );
          }
          else if (currentField.type === "textarea") {
            return (
              <div key={fieldKey} className="flex_col_center gap-2 w-full">
                <p className="font-semibold text-dark_info_blue w-full text-center">{currentField.title}</p>
                <textarea
                  className={`w-full text-text_gray rounded-md p-2 ${currentField.styles || ''} ${customStyles || ''} focus:outline-none ring-offset-background  focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  onChange={(e) => setFormData(prevData => ({ ...prevData, [fieldKey]: e.target.value }))}
                />
              </div>
            );
          }
          else {
            return (
              <div key={fieldKey} className="flex_col_center gap-2 w-full">
                <p className="font-semibold text-dark_info_blue w-full text-center">{currentField.title}</p>
                <input
                  type={currentField.type}
                  className={`w-full text-text_gray rounded-md p-2 ${currentField.styles || ''} ${customStyles || ''} focus:outline-none ring-offset-background  focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  onChange={(e) => setFormData(prevData => ({ ...prevData, [fieldKey]: e.target.value }))}
                />
              </div>
            );
          }
        })}
        <button type="submit" className="w-full mt-4 bg-info_blue hover:bg-dark_info_blue text-white rounded-xl px-4 py-2 focus:outline-none ring-offset-background  focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Submit</button>
      </form>
    </div>
  );
};

export default Form;
