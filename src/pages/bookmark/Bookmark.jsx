import React from 'react'
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Posts from '../../components/common/Posts';
import { useQuery } from '@tanstack/react-query';

const Bookmark = () => {
	const {data:authUser} =useQuery({queryKey:["authUser"]});
	
  return (
    <div  className='flex-[4_4_0] border-l border-r border-gray-700 min-h-screen'>
        <div className='flex justify-between items-center p-4 border-b border-gray-700'>
				<Link to={`/profile/${authUser?._id}`}>
									<FaArrowLeft className='w-4 h-4' />
									
								</Link>
								<div className='flex flex-col'>
									<p className='font-bold text-lg'>Bookmark</p>
									{/* <span className='text-sm text-slate-500'>blockeduser</span> */}
								</div>
								<div></div>
							
								
					
				</div>
				<Posts feedtype={"bookmark"} userId={authUser?._id}/>

    </div>
  )
}

export default Bookmark;