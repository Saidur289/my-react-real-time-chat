import React from 'react';
import { useAppStore } from '../../store';


const Profile = () => {
    const {userInfo} = useAppStore()
    console.log(userInfo);

    return (
        <div>
            Profile Pages
            <div>
                email: {userInfo?.email}
                <p>id:{userInfo?.id}</p>
            </div>
        </div>
    );
};

export default Profile;