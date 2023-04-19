import { Avatar } from '@material-tailwind/react';
import avatar from '../../assets/images/developer.jpeg';
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../AppContext/AppContext';
import {
  arrayRemove,
  collection,
  getDocs,
  query,
  updateDoc,
  where,
  doc,
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import NavBar from '../NavBar/NavBar';

const RightSide = () => {
  const [input, setInput] = useState('');
  const { user, userData } = useContext(AuthContext);
  const friendList = userData?.friends;

  const searchFriends = (data) => {
    return data.filter((item) =>
      item['name'].toLowerCase().includes(input.toLowerCase())
    );
  };

  const removeFriend = async (id, name, image) => {
    const q = query(collection(db, 'users'), where('uid', '==', user?.uid));
    const getDoc = await getDocs(q);
    const userDocumentId = getDoc.docs[0].id;

    await updateDoc(doc(db, 'users', userDocumentId), {
      friends: arrayRemove({ id: id, name: name, image: image }),
    });
  };

  return (
    <div className="flex flex-col h-screen bg-white shadow-lg border-2 rounded-l-xl">
      <div className="fixed top-0 z-10 w-full bg-white">
        <NavBar />
      </div>
      <div></div>
      <div className="mx-2 mt-16">
        <p className="font-medium text-left text-lg text-gray-700 no-underline tracking-normal leading-non">
          Friends
        </p>
        <hr />
        <input
          className="border-0 outline-none mt-4"
          type="text"
          placeholder="Search friends"
          name="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        ></input>
        {friendList?.length > 0 ? (
          searchFriends(friendList)?.map((friend) => {
            return (
              <div
                className="flex items-center justify-between hover:bg-gray-100 duration-300 ease-in-out"
                key={friend.id}
              >
                <Link to={`/profile/${friend.id}`}>
                  <div className="flex items-center my-2 cursor-pointer">
                    <div className="flex items-center">
                      <Avatar
                        size="sm"
                        variant="circular"
                        src={friend?.image || avatar}
                        alt="avatar"
                      ></Avatar>
                      <p className="ml-4 font-roboto font-medium text-sm text-gray-700 no-underline tracking-normal leading-none">
                        {friend.name}
                      </p>
                    </div>
                  </div>
                </Link>

                <div className="items-center mr-4 inline-flex">
                <Link
                    to={{ pathname: `/chat/${friend.id}`, state: { friend } }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="cursor-pointer w-5 h-5 mr-1 hover:text-indigo-500"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                      />
                    </svg>
                  </Link>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5 cursor-pointer hover:text-indigo-500"
                    onClick={() =>
                      removeFriend(friend.id, friend.name, friend.image)
                    }
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </div>
              </div>
            );
          })
        ) : (
          <p className="mt-10 font-roboto font-medium text-sm text-gray-700 no-underline tracking-normal leading-none">
            Add friends to check their profile
          </p>
        )}
      </div>
    </div>
  );
};

export default RightSide;