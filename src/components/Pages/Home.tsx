import LeftSide from '../LeftSideBar/LeftSide';
import Main from '../Main/Main'
import NavBar from '../NavBar/NavBar';
import RightSide from '../RightSideBar/RightSide';

const Home = () => {
  return (
    <div className='w-full'>
    <div className="fixed top-0 z-10 w-full bg-white">
      <NavBar />
      </div>
      <div className='flex bg-gray-100'>
        <div className="flex-auto w-[20%] fixed top-12 hidden lg:block">
          <LeftSide />
        </div>
        <div className="flex-auto w-full lg:w-[60%] absolute left-0 lg:left-[20%] top-14 bg-gray-100 rounded-xl">
          <div className="w-[95%] mx-auto mt-5">
          {/* <CardSection /> */}
          <Main />
          </div>
        </div>
        <div className="flex-auto w-[20%] fixed right-0 top-12 hidden lg:block">
          <RightSide />
        </div>
      </div>
  </div>
)}

export default Home