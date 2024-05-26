import React, { useEffect } from 'react'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import { Link, useParams } from 'react-router-dom';
import FollowerCard from "../../components/common/FollowerCard.jsx"
import { FaArrowLeft } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { mainApi } from '../../utils/api.js';

const Following = () => {
    const {id} =useParams();
	
	
	
	const {data:following,isPending,refetch,isRefetching} = useQuery({
		queryKey:["following"],
		queryFn: async () => {
			try {
				const res = await fetch(`${mainApi}api/users/following/${id}`,{
					method: "POST",
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
	console.log(following);
	useEffect(()=>{
		refetch();
	},[refetch,id])
  return (
    <>
		
        <div className='flex-[4_4_0] border-l border-r border-gray-700 min-h-screen'>
				<div className='flex justify-between items-center p-4 border-b border-gray-700'>
				<Link to={`/profile/${following?._id}`}>
									<FaArrowLeft className='w-4 h-4' />
								</Link>
								<div className='flex flex-col'>
									<p className='font-bold text-lg'>{following?.username}</p>
									<span className='text-sm text-slate-500'>{following?.following.length} Following</span>
								</div>
								<div></div>
					
				</div>
				{isPending && isRefetching && (
					<div className='flex justify-center h-full items-center'>
						<LoadingSpinner size='lg' />
					</div>
				)}
				{following?.length === 0 && <div className='text-center p-4 font-bold'>No following 🤔</div>}
				<div className="w-full bg-[#16181C] p-4 rounded-md sticky top-2">

				<div className="flex flex-col gap-4">
					{
						!isPending&& !isRefetching && following && following.following.map((user)=>(
							<FollowerCard follower={user} key={user._id}/>
						))
					}
					{
						isPending  &&<>
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

export default Following