import NavLinks from './NavLinks'
import UserLinks from './UserLinks'
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 w-full px-4 lg:px-10 md:px-8 sm:px-6 py-2">
      <Link to="/">
        <div className='sm:text-sm md:text-xl lg:text-3xl xl:text-4xl font-bold sm:text-green-500 text-gray-900 dark:text-white'>
        <span className='text-transparent bg-clip-text bg-green-400' >
                Only<span className='text-green-600'>Devs</span>
            </span>
        </div>
      </Link>
      
      <div className="flex items-center">
      <NavLinks />
      <UserLinks />
    </div>
    </div>
  )
}

export default NavBar