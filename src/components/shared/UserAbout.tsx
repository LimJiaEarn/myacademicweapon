"use client"

import { schools, levels } from '../../../constants/schools';
import { useState } from 'react';
import { useToast } from '../ui/use-toast';
import { updateUserByUserID } from '@/lib/actions/user.actions';
import { Check, X, Pencil } from 'lucide-react';
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
    <p className="text-left text-sm text-ink_soft">{fieldValue==""? placeholder : displayValue}</p>
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
        <div className="flex w-full flex-col gap-1">
          <textarea
            className="w-full rounded-lg border border-hairline bg-canvas px-2 py-1.5 text-left text-sm text-ink focus:outline-none focus:ring-2 focus:ring-pri_mint_main/40 focus:border-pri_mint_main"
            value={fieldValue === "" ? "" : fieldValue}
            name={inputName}
            onChange={handleInputChange}
            maxLength={30}
          />
          {showMaxLengthWarning ?
            <p className="text-xs text-pri_red_main">character limit reached.</p>
          :
            <p className="text-xs text-pri_navy_light">30 character limit</p>
          }
        </div>
      :
        <p className="text-left text-sm text-ink_soft">{fieldValue === "" ? placeholder : displayValue}</p>
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
    <div className="w-full">
      <div className="relative flex w-full items-center justify-between gap-2">
        <h2 className="font-display text-lg font-extrabold text-ink">
            About {isOwnUser ? 'you' : username}
        </h2>
        {isOwnUser && (
          editMode ?
          <div className="flex items-center gap-2">
            <button className="flex_center h-8 w-8 rounded-lg border border-hairline bg-white text-pri_red_main transition hover:bg-pri_red_main/5" onClick={handleCancel} title="Cancel">
              <X className="h-4 w-4" />
            </button>
            <button className="flex_center h-8 w-8 rounded-lg bg-pri_mint_main text-white shadow-mint transition hover:bg-pri_mint_dark" onClick={handleSave} title="Save">
              <Check className="h-4 w-4" />
            </button>
          </div>
          :
          <button className="flex_center h-9 w-9 rounded-lg border border-hairline bg-white text-pri_navy_main transition hover:border-pri_mint_main hover:text-pri_mint_darker" onClick={handleEdit} title="Edit profile">
            <Pencil className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-x-3 gap-y-3.5 mt-4 grid-rows-auto">



        <p className="col-span-1 flex items-center justify-start text-sm font-bold text-pri_navy_main">School:</p>
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

        <p className="col-span-1 flex items-center justify-start text-sm font-bold text-pri_navy_main">Level:</p>
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

        <p className="col-span-1 flex items-center justify-start text-sm font-bold text-pri_navy_main">Bio:</p>
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
