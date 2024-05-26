import React from 'react'
import { Link } from 'react-router-dom';
import useFollow from '../../Hooks/useFollow';
import LoadingSpinner from './LoadingSpinner';

const SuggestedCard = ({user}) => {
    const {follow,isPending} = useFollow();
    
  return (
    <Link
								to={`/profile/${user._id}`}
								className='flex items-center justify-between gap-4'
								key={user?._id}
							>
								<div className='flex gap-2 items-center'>
									<div className='avatar'>
										<div className='w-8 rounded-full'>
											<img src={user.profileImg || "/avatar-placeholder.png"} />
										</div>
									</div>
									<div className='flex flex-col'>
										<span className='font-semibold tracking-tight truncate w-28'>
											{user.fullName}
										</span>
										<span className='text-sm text-slate-500'>@{user.username}</span>
									</div>
								</div>
								<div>
									<button
										className='btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm'
										onClick={(e) =>{ e.preventDefault(); follow(user._id) }}
									>
										{isPending?<LoadingSpinner size="sm"/>:"Follow"}
									</button>
								</div>
							</Link>
                            
  )
}

export default SuggestedCard