import { useContext } from 'react'
import { AuthContext } from '../AppContext/AppContext'

const UserLinks = () => {

  const { signOutUser } = useContext(AuthContext) 

  return (
    <>
    <div className="flex justify-center items-center cursor-pointer">
      <div className="mx-4 flex items-center">
        <div className='ml-4 text-md text-black font-medium no-underline' onClick={signOutUser}>
      <div className="hover:translate-y-1 duration-500 ease-in-out hover:text-green-400">
          Sign Out
          </div>
        </div>
      </div>
    </div>
    </>
  )}

export default UserLinks