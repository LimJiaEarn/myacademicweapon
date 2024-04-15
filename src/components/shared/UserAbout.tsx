"use client"

import { useState } from 'react';
import { updateUserByUserID } from '@/lib/actions/user.actions';
import Image from 'next/image';
import { useToast } from '../ui/use-toast';

interface UserAboutProps {
    isOwnUser : boolean;
    username: string;
    currentUserProfileObject : UserObject;

}


function UserAbout({isOwnUser, username, currentUserProfileObject} : UserAboutProps) {

  const { toast } = useToast();

  const [editMode, setEditMode] = useState<boolean>(false);

  const [profile, setProfile] = useState<Record<string, string>>({
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
        updateUserByUserID(currentUserProfileObject._id, {...currentUserProfileObject, school:profile.school, level:profile.level});
    
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
    

      <input
        className="w-full px-2 text-sm md:text-md text-pri_navy_main"
        value={profile.school || "no school set"}
        name="school"
        onChange={handleChange}
        disabled={!editMode}
      />

      <input
        className="w-full px-2 text-sm md:text-md text-pri_navy_main"
        value={profile.level || "no level set"}
        name="level"
        onChange={handleChange}
        disabled={!editMode}
      />
    </div>
  );
}

export default UserAbout;
