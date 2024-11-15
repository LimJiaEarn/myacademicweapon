// Use Client Directive
"use client"

import { useState, useEffect } from "react";

import { useToast } from "@/components/ui/use-toast"


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
  compulsory: boolean;
};

// Props for the Form component
type FormProps = {
  fieldsConfig: FormFieldConfig[];
  handleSubmit: (formData: { [key: string]: string }) => void;
  customStyles?: string; // Optional, for custom styles
  clearFieldsAfterSubmit:boolean;
  initialFormValues: { [key: string]: string };
};

const Form = ({ fieldsConfig, handleSubmit, customStyles, clearFieldsAfterSubmit, initialFormValues }: FormProps) => {

  const [formData, setFormData] = useState<{ [key: string]: string }>(initialFormValues); // Initialize as an empty dictionary for form data
  const [formValid, setFormValid] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [selectValues, setSelectValues] = useState<{ [key: string]: string }>(initialFormValues); // To track the select values
  const CLEAR_FILTER_VALUE = "CLEAR_FILTER"; // Value to clear the select filters

  const { toast } = useToast();

  const onFormSubmit = async (e: React.FormEvent) => {
    setFormSubmitting(true);
    setFormValid(false);

    e.preventDefault();
    try{
      handleSubmit(formData);

      toast({
        description: "Successfully Submitted!",
      })

      if (clearFieldsAfterSubmit){
        setFormData({});
        setSelectValues({});
      }
      // this 'else' block is for admin mode where we only need to rewrite the links majority of time
      else{
        setFormData((prev)=>{
          return {
            ...prev,
            ["resourceUrl"]:'',
            ["workingUrl"]:'',
          }
        })
      }
      
    }
    catch(e){
      toast({
        description: "Error occured during submission!",
      })
    }
    finally{
      setFormSubmitting(false);
    }

  };

  const handleSelectChange = (key: string, value: string) => {
    const newSelectValues = value === CLEAR_FILTER_VALUE ? '' : value;
    setSelectValues(prevValues => ({ ...prevValues, [key]: newSelectValues }));
    setFormData(prevData => ({ ...prevData, [key]: newSelectValues }));
  };

  const checkFormValidity = () => {
    const isValid = fieldsConfig.every((field) => {
      const isFieldValid = !field.compulsory || (field.compulsory && formData[field.id]?.trim().length > 0);
      return isFieldValid;
    });
    return isValid;
  };

  useEffect(() => {
    // Update form validity whenever formData changes
    setFormValid(checkFormValidity());
  }, [formData, fieldsConfig]);


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
                    <SelectValue className="w-full bg-blue-200 flex_col_center gap-2 text-pri_navy_darker"/>
                  </SelectTrigger>
                  <SelectContent className="w-full bg-blue-200 flex_col_center gap-2 text-pri_navy_darker">
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
                  value={(fieldKey in formData && formData[fieldKey]) || ''}
                  className={`w-full text-black rounded-md p-2 ${currentField.styles || ''} ${customStyles || ''} focus:outline-none ring-offset-background focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
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
                  value={(fieldKey in formData && formData[fieldKey]) || ''}
                  className={`w-full text-black rounded-md p-2 ${currentField.styles || ''} ${customStyles || ''} focus:outline-none ring-offset-background focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  onChange={(e) => setFormData(prevData => ({ ...prevData, [fieldKey]: e.target.value }))}
                />
              </div>
            );
          }
        })}
        <button
          type="submit"
          className={`w-full mt-4 text-white rounded-xl px-4 py-2 focus:outline-none ring-offset-background focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            formValid
              ? 'bg-info_blue hover:bg-dark_info_blue' // Apply these styles only if the form is valid
              : 'bg-gray-400 cursor-not-allowed' // Otherwise, use a gray background and show a not-allowed cursor
          }`}
          disabled={!formValid && !formSubmitting} // Disable the button based on formValid state
        >
          {formSubmitting ? 'Submitting...' : 'Submit'}
        </button>


      </form>
    </div>
  );
};

export default Form;
