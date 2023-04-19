import LeftSide from '../LeftSideBar/LeftSide'
import Main from '../Main/Main'
import NavBar from '../NavBar/NavBar';
import RightSide from '../RightSideBar/RightSide';
import { Avatar } from '@material-tailwind/react';
import avatar from '../../assets/images/developer.jpeg';
import {
    collection,
    query,
    onSnapshot,
    where,
    getDocs,
    updateDoc,
    arrayUnion,
  } from "firebase/firestore";
  import { db } from "../firebase/firebase";
import { useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from "../AppContext/AppContext";
import addFriend from "../../assets/images/add-friend.png";
import background from '../../assets/images/background.jpeg'



const FriendProfile = () => {

    const { id } = useParams();
    const [ profile, setProfile ] = useState(null);

    const { user } = useContext(AuthContext);

    useEffect(() => {
        const getUserProfile = async () => {
          const q = query(collection(db, "users"), where("uid", "==", id));
          await onSnapshot(q, (doc) => {
            setProfile(doc.docs[0].data());
          });
        };
        getUserProfile();
      }, [id]);


      const addUser = async () => {
        try {
            const q = query(collection(db, "users"), where("uid", "==", user.uid));
            const doc = await getDocs(q);
            const data = doc.docs[0].ref;
            await updateDoc(data, {
                friends: arrayUnion({
                    id: profile.uid,
                    image: profile.image || {avatar},
                    name: profile.name
                })
            })
        } catch (error) {
            console.log(error.message)
        }
    }



  return (
    <div className='w-full'>
      <div className="fixed top-0 z-10 w-full bg-white">
        <NavBar />
      </div>
      <div className='flex bg-gray-100'>
        <div className="flex-auto w-[20%] fixed top-12 hidden sm:block">
          <LeftSide />
        </div>
        <div className='flex-auto w-full md:w-[60%] absolute left-0 md:left-[20%] top-14 bg-gray-100 rounded-xl'>
          <div className="w-[95%] mx-auto">
            <div>
                <div className='relative py-4'>
                    {/* <div className="h-96 w-full bg-green-500"></div> */}
                    <div className="h-96 w-full" style={{ backgroundImage: `url(${background})` }}></div>
                    <div className="absolute top-10 right-8">
                    {user?.uid !== profile?.uid && (
                        <div
                          onClick={addUser}
                          className="flex justify-end cursor-pointer"
                        >
                          <img
                            className="hover:bg-blue-100 rounded-xl p-2"
                            src={addFriend}
                            alt="addFriend"
                          ></img>
                        </div>
                      )}

                    </div>
                    <div className='absolute bottom-12 left-6'>
                      
                    <Avatar 
                        src={profile?.image || avatar}
                        alt="avatar"
                        size="xxl"
                        variant="circular"
                    />
                  <p className="py-2 font-roboto font-medium text-xl text-white no-underline tracking-normal leading-none">
                    {profile?.name}
                    </p>

                    <p className="py-2 font-roboto font-medium text-xl text-white no-underline tracking-normal leading-none">
                    {profile?.email}
                     </p>
                    </div>
                  <div className="flex flex-col absolute right-6 bottom-12">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#fff"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                      />
                    </svg>

                    <span className="ml-2 py-2 font-roboto font-medium text-xl text-black no-underline tracking-normal leading-none">
                    {`Studies ${profile?.languages}`}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#fff"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819"
                      />
                    </svg>

                    <span className="ml-2 py-2 font-roboto font-medium text-xl text-black no-underline tracking-normal leading-none">
                      {`Lives in ${profile?.location}`}
                    </span>
                  </div>
                </div>
                </div>
            </div>
          <Main />
          </div>
        </div>
        <div className="flex-auto w-[20%] fixed right-0 top-12 hidden sm:block">
          <RightSide />
        </div>
      </div>
  </div>

    
  )
}

export default FriendProfile