import React from 'react'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { mainApi } from '../../utils/api.js';
import FollowerCard from '../../components/common/FollowerCard.jsx';

const BlockPage = () => {

    const {data:blockedusers,isPending} = useQuery({
		queryKey:["blockedusers"],
		queryFn: async () => {
			try {
				const res = await fetch(`${mainApi}api/users/blockedusers`,{
					method: "GET",
					headers:{
						"Content-Type": "application/json",
						'auth-token': localStorage.getItem('token'),
					}
				});
				const data = await res.json();
				
				if (!res.ok) {
					
					throw new Error(data.error || "Something went wrong");
				}
				
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},   
		
		
	});
    console.log(blockedusers);
  return (
    <>
		
        <div className='flex-[4_4_0] border-l border-r border-gray-700 min-h-screen'>
				<div className='flex justify-between items-center p-4 border-b border-gray-700'>
				<Link to={`/profile/${blockedusers?._id}`}>
									<FaArrowLeft className='w-4 h-4' />
								</Link>
								<div className='flex flex-col'>
									<p className='font-bold text-lg'>{blockedusers?.username}</p>
									<span className='text-sm text-slate-500'>{blockedusers?.blockedUser.length} blockeduser</span>
								</div>
								<div></div>
					
				</div>
				{isPending  && (
					<div className='flex justify-center h-full items-center'>
						<LoadingSpinner size='lg' />
					</div>
				)}
				<div className="w-full bg-[#16181C] p-4 rounded-md sticky top-2">

				<div className="flex flex-col gap-4">
				{blockedusers?.blockedUser.length === 0 && <div className='text-center p-4 font-bold'>No blockedusers 🤔</div>}

					{
						!isPending && blockedusers && blockedusers.blockedUser.map((blockeduser)=>(
							<FollowerCard follower={blockeduser} key={blockeduser._id} blockPage={true}/>
						))
					}
					{
						isPending &&<>
							<div className='flex justify-center h-full items-center'>
						<LoadingSpinner size='lg' />
					</div>
						</>
					}
				</div>
				</div>
			</div>
        </>

  )
}

export default BlockPage