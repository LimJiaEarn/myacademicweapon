"use client"

import { schools, levels } from '../../../constants/schools';
import { useState } from 'react';
import { useToast } from '../ui/use-toast';
import { updateUserByUserID } from '@/lib/actions/user.actions';
import Image from 'next/image';
import { ComboBox } from '../ui/combobox';

interface UserAboutProps {
    isOwnUser : boolean;
    username: string;
    currentUserProfileObject : UserObject;

}

interface SelectFieldProps {
  displayValue: string;
  contents: string[];
  fieldValue: string;
  placeholder: string;
  inputName: string;
  editMode: boolean;
  setEditProfile: React.Dispatch<React.SetStateAction<{}>>;
}

interface InputFieldProps {
  displayValue: string;
  fieldValue: string;
  placeholder: string;
  inputName: string;
  editMode: boolean;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}



const SearchSelectField = ({contents, displayValue, fieldValue, placeholder, inputName, editMode, setEditProfile} : SelectFieldProps) =>{

  return(
    
    <div className="w-full">
    {editMode?
      <ComboBox
        inputName={inputName}
        contents={contents}
        placeholder={fieldValue==""? placeholder : fieldValue}
        setEditProfile={setEditProfile}
      />
    :
    <p className="text-left text-sm text-pri_navy_light">{fieldValue==""? placeholder : displayValue}</p>
  }
    </div>
    
  
  )

}

const InputField = ({displayValue, fieldValue, placeholder, inputName, editMode, handleChange} : InputFieldProps) => {
  const [showMaxLengthWarning, setShowMaxLengthWarning] = useState(displayValue.length >= 30);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    if (value.length <= 30) {
      handleChange(e);
    }
    setShowMaxLengthWarning(value.length >= 30);
  }



  return (
    <div className="flex justify-start items-center gap-2">
      {editMode ?
        <div className="flex_col_center gap-1">
          <textarea
            className="w-full px-2 py-1 text-sm text-pri_navy_main bg-pri_bg_card text-left"
            value={fieldValue === "" ? "" : fieldValue}
            name={inputName}
            onChange={handleInputChange}
            maxLength={30}
          />
          {showMaxLengthWarning ?
            <p className="text-xs text-red-500">character limit reached.</p>
          :
            <p className="text-xs text-slate-400">30 character limit</p>
          }
        </div>
      :
        <p className="text-left text-sm text-pri_navy_light">{fieldValue === "" ? placeholder : displayValue}</p>
      }
    </div>
  );
};


function UserAbout({isOwnUser, username, currentUserProfileObject} : UserAboutProps) {

  const { toast } = useToast();

  const [editMode, setEditMode] = useState<boolean>(false);

  const [profile, setProfile] = useState<Record<string, string>>({
    bio: currentUserProfileObject.bio || "",
    school: currentUserProfileObject.school || "",
    level: currentUserProfileObject.level || ""
  });

  const [editProfile, setEditProfile] = useState<Record<string, string>>({
    bio: currentUserProfileObject.bio || "",
    school: currentUserProfileObject.school || "",
    level: currentUserProfileObject.level || ""
  })

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    
    setProfile((prevValue)=>({
      ...prevValue,
      bio: editProfile.bio,
      school: editProfile.school,
      level: editProfile.level
    }));
    


    try{
        await updateUserByUserID(currentUserProfileObject._id, {...currentUserProfileObject, bio:editProfile.bio, school:editProfile.school, level:editProfile.level});
        toast({
            description:"Profile Updated!"
        })
    }
    catch (error){
        toast({
            description:"Encountered error in updating profile. Try again later!"
        })
    }

    setEditMode(false);

  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditProfile(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditProfile(profile);
  };

  return (
    <div className="flex_col_center w-full">
      <div className="flex justify-center items-end gap-2 w-full relative">
        <h2 className="text-lg font-bold md:text-md text-pri_navy_dark text-start">
            About {isOwnUser ? 'You' : username}
        </h2>
        {isOwnUser && (
          editMode ?
          <div className="absolute top-0 right-0 w-[50] flex_center gap-2">
          <button className="cursor-pointer hover:bg-red-600 bg-red-500 rounded-lg p-1" onClick={handleCancel}>
            <Image src='/icons/cancelW.svg' alt='save' height={18} width={18} />
          </button>
          <button className="cursor-pointer hover:bg-blue-600 bg-blue-500 rounded-lg p-1" onClick={handleSave}>
            <Image src='/icons/saveW.svg' alt='save' height={18} width={18} />
          </button>
          
          </div>
          
          :
          <button className="cursor-pointer hover:scale-105 absolute top-0 right-0" onClick={handleEdit}>
            <Image src='/icons/edit.svg' alt='edit' height={30} width={30} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 mt-2 grid-rows-auto">



        <p className="col-span-1 text-left text-md font-semibold text-pri_navy_main flex justify-start items-center">School:</p>
        <div className="col-span-2">
          <SearchSelectField
            contents={schools}
            displayValue={profile.school}
            fieldValue={editProfile.school}
            placeholder={isOwnUser ? "+set school" : "no sch set"}
            inputName="school"
            editMode={editMode}
            setEditProfile={setEditProfile}
          />
        </div>

        <p className="col-span-1 text-left text-md font-semibold text-pri_navy_main flex justify-start items-center">Level:</p>
        <div className="col-span-2">
          <SearchSelectField
            contents={levels}
            displayValue={profile.level}
            fieldValue={editProfile.level}
            placeholder={isOwnUser ? "+set level" : "no level set"}
            inputName="level"
            editMode={editMode}
            setEditProfile={setEditProfile}
          />
        </div>

        <p className="col-span-1 text-left text-md font-semibold text-pri_navy_main flex justify-start items-center">Bio:</p>
        <div className="col-span-2">
          <InputField
            displayValue={profile.bio}
            fieldValue={editProfile.bio}
            placeholder={isOwnUser ? "+set bio" : "no bio set"}
            inputName="bio"
            editMode={editMode}
            handleChange={handleChange}
          />
        </div>

      </div>








    </div>
  );
}

export default UserAbout;
