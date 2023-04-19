import { useContext, useEffect, useReducer, useState } from "react"
import { AuthContext } from "../AppContext/AppContext";
import { PostReducer, postActions, postsStates } from "../AppContext/PostReducer";
import { doc, setDoc, collection, query, onSnapshot, where, getDocs, updateDoc, arrayUnion, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Avatar } from "@material-tailwind/react";
import CommentSection from "./CommentSection";
import avatar from '../../assets/images/developer.jpeg';



const PostCard = ({ uid, id, logo, name, email, text, image, timestamp }) => {
    const { user } = useContext(AuthContext);
    const [state, dispatch] = useReducer(PostReducer, postsStates);
    const [open, setOpen] = useState(false);
    const singlePostDocument = doc(db, "posts", id);
 
    const likesRef = doc(collection(db, "posts", id, "likes"));
    const likesCollection = collection(db, "posts", id, "likes");

    const { ADD_LIKE, HANDLE_ERROR } = postActions;

    const handleOpen = (e) => {
        e.preventDefault();
        setOpen(true);
    }

    const addUser = async () => {
        try {
            const q = query(collection(db, "users"), where("uid", "==", user?.uid));
            const doc = await getDocs(q);
            const data = doc.docs[0].ref;
            await updateDoc(data, {
                friends: arrayUnion({
                    id: uid,
                    image: logo,
                    name: name
                })
            })
        } catch (error) {
            console.log(error.message)
        }
    }

    const handleLike = async (e) => {
        e.preventDefault();
        const q = query(likesCollection, where("id", "==", user?.uid));
        const querySnapshot = await getDocs(q);
        const likesDocId = await querySnapshot?.docs[0]?.id;

        try {
            if(likesDocId !== undefined) {
                const deleteId = doc(db, "posts", id, "likes", likesDocId);
                await deleteDoc(deleteId);
            } else {
                await setDoc(likesRef, {
                    id: user?.uid
                })
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    const deletePost = async (e) => {
        e.preventDefault();
        try {
          if (user?.uid === uid) {
            await deleteDoc(singlePostDocument);
          } else {
            alert("You cant delete other users posts!");
          }
        } catch (err) {
          alert(err.message);
          console.log(err.message);
        }
      };
    
    useEffect(() => {
      const q = collection(db, "posts", id, "likes");
  
      const unsubscribe = onSnapshot(q, (doc) => {
          const likes = doc.docs.map((item) => item.data());
          dispatch({
              type: ADD_LIKE,
              likes,
          });
      }, (error) => {
          console.log(error.message);
          dispatch({ type: HANDLE_ERROR });
      });
  
      return unsubscribe;
  }, [id, ADD_LIKE, HANDLE_ERROR]);
  

  return (
    <>
    <div className="mb-4">
        <div className="flex flex-col py-4 bg-white rounded-t-3x1">
            <div className="flex items-center pb-4 ml-4">
                <Avatar 
                    size="md"
                    variant="circular"
                    src={logo || avatar}
                    alt="avatar"/>
                <div className="flex flex-col ml-4">
            <p className=" py-2 font-roboto font-medium text-md text-back-900 text-left no-underline tracking-normal leading-none">
              {name}
            </p>
            <p className="whitespace-nowrap font-roboto font-medium text-md text-gray-700 no-underline tracking-normal leading-none text-left">
              {timestamp}
            </p>
          </div>
          {user?.uid !== uid && (
            <div
              onClick={addUser}
              className="w-full flex justify-end cursor-pointer mr-10"
            >
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                  />
                </svg>
            </div>
          )}
            </div>
            <div>
            {image && (
              <img
                className="mx-auto max-w-full max-h-[500px] object-contain"
                src={image}
                alt="postImage"
              ></img>
            )}
          <p className="mt-6 ml-6 pb-4 font-roboto font-medium text-left text-lg text-black-700 no-underline tracking-normal leading-none">
            {text}
          </p>

        </div>
        <div className="flex justify-around items-center pt-4">
          <button
            className="flex items-center cursor-pointer rounded-lg p-2 hover:bg-gray-100"
            onClick={handleLike}
          >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
                />
              </svg>

            {state.likes?.length > 0 && (
              <span className="text-md font-medium text-black-700 ml-1">{state.likes.length}</span>
            )}
          </button>
          <div
            className="flex items-center cursor-pointer rounded-lg p-2 hover:bg-gray-100"
            onClick={handleOpen}
          >
            <div className="flex items-center cursor-pointer">
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                  />
                </svg>

              <p className="font-roboto font-medium text-md text-black-700 no-underline tracking-normal leading-none">
                Comments
              </p>
            </div>
          </div>
          {user?.uid === uid && <div
            className="flex items-center cursor-pointer rounded-lg p-2 hover:bg-gray-100"
            onClick={deletePost}
          >
             <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
          </div>}
        </div>
        {open && <CommentSection postId={id} />}
      </div>
    </div>
    </>
  )
}

export default PostCard;