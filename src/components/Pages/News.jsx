import LeftSide from '../LeftSideBar/LeftSide'
import NavBar from '../NavBar/NavBar'
import RightSide from '../RightSideBar/RightSide'

import { useState, useEffect } from 'react';
import axios from 'axios';


const News = () => {

    const [posts, setPosts] = useState([]);

  useEffect(() => {
    const subreddit = 'learnprogramming';
    const timeFilter = 'week';
    const endpoint = `https://www.reddit.com/r/${subreddit}/top.json?t=${timeFilter}&limit=9`;

    axios.get(endpoint).then((response) => {
      setPosts(response.data.data.children.map((post) => post.data));
    });
  }, []);

  return (
    <div className="w-full">
    <div className="fixed top-0 z-10 w-full bg-white">
      <NavBar />
    </div>
    <div className="flex bg-gray-100 ml-[20%] lg:ml-0">
  <div className="fixed left-0 top-0 h-screen w-full bg-gradient-to-tl from-green-400 to-green-700"></div>
  <div className="flex-auto w-[20%] fixed top-12 hidden bg-white lg:block">
    <LeftSide />
  </div>
  <div className="fixed flex-auto w-screen md:w-[60%] left-0 md:left-[20%] top-14 h-screen overflow-y-scroll">
  <div className="py-16 px-4 text-white text-4xl font-light rounded-xl">Best of REDDIT this week</div>
          <div className='w-[80%] sm:w-[75%] mx-auto'>
            <ul
              className="grid grid-cols-1 gap-4"
              style={{ gridTemplateColumns: '1fr' }}
            >
              {posts.map((post) => (
                <li
                  key={post.id}
                  className="border border-gray-200 hover:bg-gray-100 py-2 px-4 flex items-center justify-between bg-white rounded-md mb-4"
                >
                  <div className="flex text-left items-center">
                    <div className="ml-3">
                      <a href={`https://www.reddit.com${post.permalink}`}>
                      <div className="font-semibold text-gray-800">
                        {post.title}
                      </div>
                      <div className="text-gray-600">
                        posted by {post.author} to {post.subreddit} •{' '}
                        {post.num_comments} comments
                      </div>
                      </a>
                    </div>
                  </div>
                  <div className="text-gray-500">{post.score} points</div>
                  
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="flex-auto w-[20%] fixed right-0 top-12 hidden lg:block">
        <RightSide />
      </div>
    </div>
  



  );
  }

export default News