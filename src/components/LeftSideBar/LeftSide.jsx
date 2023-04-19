import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AppContext/AppContext';
import { Tooltip } from '@material-tailwind/react';
import { Avatar } from '@material-tailwind/react';
import avatar from '../../assets/images/developer.jpeg';
import { Link } from 'react-router-dom';
import { db } from '../firebase/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const LeftSide = () => {
  const { user, userData } = useContext(AuthContext);
  const [mobs, setMobs] = useState([]);

  useEffect(() => {
    const fetchMobs = async () => {
      // const q = query(collection(db, "mobs"), where("members", "array-contains", user?.displayName));
      const q = query(
        collection(db, 'mobs'),
        where('members', 'array-contains', {
          uid: user?.uid,
          name: user?.displayName,
          email: user?.email,
          image: user?.photoURL,
        })
      );
      const querySnapshot = await getDocs(q);
      const mobsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMobs(mobsData);
    };
    fetchMobs();
  }, [user]);

  return (
    <div className="flex flex-col h-screen gh-white pb-4 border-2 rounded-r-xl shadow-lg">
      <div className="flex flex-col items-center relative">
        <div className="h-28 w-full rounded-r-xl bg-gradient-to-tl from-green-400 to-indigo-900"></div>
        <div className="absolute -bottom-6">
          <Tooltip content="Profile" placement="top">
            <Avatar
              src={user?.photoURL || avatar}
              alt="avatar"
              className="h-16 w-16"
            ></Avatar>
          </Tooltip>
        </div>
      </div>
      <div className="flex flex-col items-center pt-10">
        <p className="font-medium text-md text-gray-700 no-underline tracking-normal leading-none">
          {user?.displayName || userData?.name}
        </p>
      </div>
      <div className="flex flex-col pl-2">
        <div className="flex justify-center items-center pt-4 pr-2">
          <div className="bg-white justify-center w-full p-2 rounded-md shadow-md items-center inline-flex min-w-min">
            <p className="text-md text-black no-underline tracking-normal leading-none mx-2">
              Find and create mobs
            </p>
            <Link to="/mobs">
            <button className="ml-4 bg-green-400 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                // stroke-width="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  // stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </button>
            </Link>
          </div>
        </div>

        <div>
          <div className="mt-6 font-bold">Your mobs</div>
          <hr className='mr-2'/>
          {mobs.map((mob) => (
            <div
              key={mob.id}
              className="flex justify-between items-center mt-4 ml-3 mr-4"
            >
              <h2>{mob.name}</h2>
              <button className="ml-2 bg-green-500 text-white px-2 py-1 rounded">
                CHAT
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeftSide;