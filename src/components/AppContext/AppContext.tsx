import { 
    GoogleAuthProvider, 
    signInWithPopup, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
} from "firebase/auth";
import { createContext, ReactNode, useEffect, useState } from "react";
import { db, auth, onAuthStateChanged } from "../firebase/firebase";
import { query, where, collection, getDocs, addDoc, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";


interface AuthContextType {
    signInWithGoogle: () => void;
    loginWithEmailAndPassword: (email: string, password: string) => void;
    registerWithEmailAndPassword: (name: any, email: string, password: string) => void;
    sendPasswordToUser: (email: string) => void;
    signOutUser: () => void;
    user: any;
    userData: any;
  }
  
export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

interface AppContextProps {
    children: ReactNode;
  }

const AppContext = ({ children }: AppContextProps) => {

    const collectionUserRef = collection(db, "users");
    const provider = new GoogleAuthProvider();
    const [ user, setUser ] = useState<any>();
    const [ userData, setUserData ] = useState<any>();
    const navigate = useNavigate();
    
const signInWithGoogle = async () => {
        try {
        const popup = await signInWithPopup(auth, provider);
        const user = popup.user;
        const q = query(collectionUserRef, where("uid", "==", user.uid))
        const docs = await getDocs(q);
        if(docs.docs.length === 0) {
            await addDoc(collectionUserRef, {
                uid: user?.uid,
                name: user?.displayName,
                email: user?.email,
                image: user?.photoURL,
                authProvider: popup?.providerId,
            })
        }} catch (err: any) {
            alert(err.message);
            console.log(err.message)}
    }

const loginWithEmailAndPassword = async (email: string, password: string) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);        
    } catch (err: any) {
        console.log(err.message)
    }
}

const registerWithEmailAndPassword = async (name: any, email: string, password: string) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password)
        const user = res.user;
        await addDoc(collectionUserRef, {
            uid: user.uid,
            name,
            providerId: "email/password",
            email: user.email,
        })
    } catch (err: any) {
        console.log(err.message)
    }
}

const sendPasswordToUser = async (email: string) => {
    try {
        await sendPasswordResetEmail(auth, email);
        alert("New password sent to your email")
    } catch (err: any) {
        console.log(err.message)
    }
}
    
const signOutUser = async () => {
    await signOut(auth);
}

const userStateChanged = async () => {
    onAuthStateChanged(auth, async (user) => {
        if(user) {
            const q = query(collectionUserRef, where("uid", "==", user?.uid))
            await onSnapshot(q, (doc) => {
                setUserData(doc?.docs[0]?.data())
            });
        setUser(user);
        } else {
            setUser(null);
            navigate("/login");
        }
    })
}

useEffect((): (() => void) | void | undefined   => {
    userStateChanged();
    if (user || userData) {
        navigate("/")
    } else {
        navigate("/login")
    }
    return () => userStateChanged();
}, [])


// props to the children of AuthContext.Provider
const initialState = {
    signInWithGoogle: signInWithGoogle,
    loginWithEmailAndPassword: loginWithEmailAndPassword,
    registerWithEmailAndPassword: registerWithEmailAndPassword,
    sendPasswordToUser: sendPasswordToUser,
    signOutUser: signOutUser,
    user: user,
    userData: userData,
};

  return (
    <div>
        <AuthContext.Provider value={initialState}>
            {children}
        </AuthContext.Provider>
    </div>
  )
}

export default AppContext