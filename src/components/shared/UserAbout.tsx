"use client"

import { schools, levels } from '../../../constants/studentconstants';
import { useState } from 'react';
import { useToast } from '../ui/use-toast';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateUserByUserID } from '@/lib/actions/user.actions';
import Image from 'next/image';
import { ComboBox } from '../ui/combobox';

interface UserAboutProps {
    isOwnUser : boolean;
    username: string;
    currentUserProfileObject : UserObject;

}

interface SelectFieldProps {
  title: string;
  contents: string[];
  fieldValue: string | null;
  placeholder: string;
  inputName: string;
  editMode: boolean;
  setProfile: React.Dispatch<React.SetStateAction<{}>>;
}

interface InputFieldProps {
  title: string;
  fieldValue: string | null;
  placeholder: string;
  inputName: string;
  editMode: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SelectField = ({title, contents, placeholder, inputName, editMode, setProfile} : SelectFieldProps) =>{
  
    return(
      <div className="flex_center">
      
      <p>{title}:</p>
      <>
        <Select
          onValueChange={(value)=>{
            setProfile(prevState => ({
              ...prevState,
              [inputName]: value
            }));
          }}
          disabled={!editMode}
        >
          <SelectTrigger className="w-[200px] border-none">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {contents.map((content)=><SelectItem value={content}>{content}</SelectItem>)}

          </SelectContent>
        </Select>

      </>
      </div>)
}

const SearchSelectField = ({title, contents, placeholder, inputName, editMode, setProfile} : SelectFieldProps) =>{

  return(
    <div className="flex_center">
    
    <p>{title}:</p>
    <>
      <ComboBox
        contents={contents}
        placeholder={placeholder}
      />
    </>
    </div>
    
  
  )

}

const InputField = ({title, fieldValue, placeholder, inputName, editMode, handleChange} : InputFieldProps) => {


    return (
      <div className="flex_center gap-2">
        <p>{title}:</p>
        <input
          className="w-full px-2 text-sm md:text-md text-pri_navy_main"
          value={fieldValue || placeholder}
          name={inputName}
          onChange={handleChange}
          disabled={!editMode}
        />
      </div>
    
    )
}


function UserAbout({isOwnUser, username, currentUserProfileObject} : UserAboutProps) {

  const { toast } = useToast();

  const [editMode, setEditMode] = useState<boolean>(false);

  const [profile, setProfile] = useState<Record<string, string>>({
    bio: currentUserProfileObject.bio || "",
    school: currentUserProfileObject.school || "",
    level: currentUserProfileObject.level || ""
  });

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = () => {
    setEditMode(false);

    // Here you would typically send the updated profile data to the server
    // For example using fetch API to update MongoDB database
    try{
        updateUserByUserID(currentUserProfileObject._id, {...currentUserProfileObject, bio:profile.bio, school:profile.school, level:profile.level});
    
        toast({
            description:"Profile Updated!"
        })
    }
    catch (error){
        toast({
            description:"Encountered error in updating profile. Try again later!"
        })
    }


  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div className="flex_col_center w-full">
      <div className="flex justify-center items-end gap-2 w-full relative">
        <h2 className="text-lg font-bold md:text-md text-pri_navy_dark text-start">
            About {isOwnUser ? 'You' : username}
        </h2>
        {isOwnUser && (
          editMode ?
          <button className="cursor-pointer absolute top-0 right-0" onClick={handleSave}>
            <Image src='/icons/save.svg' alt='save' height={25} width={25} />
          </button>
          :
          <button className="cursor-pointer absolute top-0 right-0" onClick={handleEdit}>
            <Image src='/icons/edit.svg' alt='edit' height={30} width={30} />
          </button>
        )}
      </div>

      <InputField
        title="Bio"
        fieldValue={profile.bio}
        placeholder="no bio set"
        inputName="bio"
        editMode={editMode}
        handleChange={handleChange}
      />

      <SearchSelectField
        title="School"
        contents={schools}
        fieldValue={profile.level}
        placeholder="+set school"
        inputName="school"
        editMode={editMode}
        setProfile={setProfile}
      />



      <SelectField
        title="Level"
        contents={levels}
        fieldValue={profile.level}
        placeholder="+set level"
        inputName="level"
        editMode={editMode}
        setProfile={setProfile}
      />


    </div>
  );
}

export default UserAbout;
