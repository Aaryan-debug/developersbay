import { Key, useContext, useEffect, useReducer, useRef, useState } from "react"
import { AuthContext } from "../AppContext/AppContext"
import { doc, setDoc, collection, serverTimestamp, orderBy, query, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { PostReducer, postActions, postsStates } from "../AppContext/PostReducer";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import PostCard from "./PostCard";
import { Avatar } from '@material-tailwind/react';
import avatar from '../../assets/images/developer.jpeg';
import UserList from "../Pages/UserList";
import { useMediaQuery } from "@react-hook/media-query";

const Main = () => {
  const { user, userData } = useContext(AuthContext);
  const text = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null)
  const [image, setImage] = useState<string>('');
  const [file, setFile] = useState<any>(null);

  const [state, dispatch] = useReducer(PostReducer, postsStates);
  const {SUBMIT_POST, HANDLE_ERROR} = postActions

  const collectionPosts = collection(db, "posts");
  const posts = doc(collection(db, "posts"));
  const document = posts.id;

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  }
  
  const handleSubmitPost = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if(text.current && text.current.value !== "") {
      try {
        if(text.current.value !== "")
          await setDoc(posts, {
            documentId: document,
            uid: user?.uid || userData?.uid,
            logo: user?.photoURL,
            name: user?.displayName || userData?.name,
            email: user?.email || userData?.email,
            text: text.current.value,
            image: image,
            timestamp: serverTimestamp(),
          });
          text.current.value = "";
        
      } catch (error: any) {
        dispatch({
          type: HANDLE_ERROR,
        })
        console.log(error.message)
      }  
    } else {
      dispatch({
        type: HANDLE_ERROR,
      })
    }
  }

  const storage = getStorage();

  const metadata = {
    contentType: ['image/jpeg', "image/jpg", "image/png", "image/gif", "image/svg+xml"]
  };


  const submitImage = async () => {
    const fileType = file?.["type"] && metadata.contentType.includes(file["type"]);
    if(!file) return;
    if(fileType) {
      try {
        const storageRef = ref(storage, `images/${file.name}`);
        const uploadTask = uploadBytesResumable(
          storageRef, file, file?.["type"]
        );
        await uploadTask.on("state_changed", (snapshot) => {
          // const progress = Math.round(
          //   (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          // );
          // setProgressBar(progress);
        },
        (error) => {
          alert(error)
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setImage(downloadURL);
        }
        );
      } catch (error: any) {
        dispatch({type: HANDLE_ERROR})
        console.log(error.message)
      }
    }
  }

const postData = async () => {
  const q = query(collectionPosts, orderBy("timestamp", "desc"));
  await onSnapshot(q, (doc) => {
    dispatch({
      type: SUBMIT_POST,
      posts: doc?.docs?.map((item) => item?.data()),
    });
    setImage('');
    setFile(null);
  })
};

useEffect(() => {
  postData();
}, [dispatch])

const isMobile = useMediaQuery('(max-width: 640px)');

  return (

    <div className="flex flex-col item-center">
      <div className="flex flex-col py-4 w-full bg-white rounded-3xl shadow-lg">
        <div className="flex items-center border-b-2 border-gray-300 pb-4 pl-4 w-full">
          <Avatar
            size="md"
            variant="circular"
            src={user?.photoURL || avatar}
            alt="avatarPhoto"
          ></Avatar>

          <form className="w-full" onSubmit={handleSubmitPost}>
            <div className="flex justify-between items-center">
              <div className="w-full ml-4">
                <input
                  name="text"
                  type="text"
                  placeholder={
                    isMobile
                      ? "What's up?"
                      : `What's on your mind, ${
                          userData?.name || user?.displayName
                        }?`
                  }
                  className="outline-none w-full bg-white rounded-md"
                  ref={text}
                ></input>
              </div>
              <div className="mx-4 max-w-md h-auto">
                {image && <img src={image} alt="previewImage" />}
              </div>
              <div>
                <button className="mr-4 px-6 py-3 text-lg hover:translate-y-1 duration-500 ease-in-out text-indigo-400 hover:text-indigo-900" type="submit">
                  SHARE
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="flex justify-around items-center pt-4">
          <div className="flex items-center">
            <label
              htmlFor="addImage"
              className="cursor-pointer flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-8 h-8 hover:translate-y-1 duration-500 ease-in-out hover:text-green-500"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
              <input
                type="file"
                id="addImage"
                style={{ display: 'none' }}
                onChange={handleUpload}
              ></input>
            </label>
            {file && (
              <button className="ml-2" type="submit" onClick={submitImage}>
                Upload
              </button>
            )}
          </div>
        </div>
      </div>
      <UserList />

      <div className="flex flex-col pb-4 w-full">
        {state.posts.length > 0 &&
          state?.posts.map(
            (
              post: {
                logo: any;
                documentId: any;
                uid: any;
                name: any;
                email: any;
                image: any;
                text: any;
                timestamp: { toDate: () => string | number | Date };
              },
              index: Key | null | undefined
            ) => {
              return (
                <PostCard
                  key={index}
                  logo={post.logo}
                  id={post.documentId}
                  uid={post.uid}
                  name={post.name}
                  email={post.email}
                  image={post.image}
                  text={post.text}
                  timestamp={new Date(post?.timestamp?.toDate()).toLocaleString(
                    'en-US',
                    {
                      day: 'numeric',
                      month: 'short',
                      hour: 'numeric',
                      minute: 'numeric',
                    }
                  )}
                />
              );
            }
          )}
      </div>
      <div ref={scrollRef}></div>
    </div>
  );
}

export default Main;