import React from 'react'
import { Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import useFollow from '../../Hooks/useFollow';
import { useQuery } from '@tanstack/react-query';
import useBlock from '../../Hooks/useBlock';

const FollowerCard = ({follower,blockPage=false}) => {
    // const isPending = false;
    const {isPending,follow} = useFollow();
    const {block,isPending:isBlocking} = useBlock();
    const {data:authUser} =useQuery({queryKey:["authUser"]});
    
    const amIfollow = authUser.following.includes(follower._id);
    const amIBlock = authUser.blockedUser.includes(follower._id);
    const itsMe = follower._id!==authUser._id
    return (

        <Link
            to={`/profile/${follower._id}`}
            className='flex items-center justify-between gap-4'
            key={follower._id}
        >
            <div className='flex gap-2 items-center'>
                <div className='avatar'>
                    <div className='w-8 rounded-full'>
                        <img src={follower.profileImg ||  "/avatar-placeholder.png"} />
                    </div>
                </div>
                <div className='flex flex-col'>
                    <span className='font-semibold tracking-tight truncate w-28'>
                        {follower.fullName}
                    </span>
                    <span className='text-sm text-slate-500'>@{follower.username}</span>
                </div>
            </div>
            <div>
                {itsMe&&!blockPage &&(

                    <button
                    className='btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm'
                    onClick={(e) => { e.preventDefault(); follow(follower._id) }}
                    >
                    {isPending ? <LoadingSpinner size="sm" /> : `${amIfollow?"unfollow":"follow"}`}
                </button>)
                }
                
                 {   blockPage && (
                        <button
                    className='btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm'
                    onClick={(e) => { e.preventDefault(); block(follower._id) }}
                    >
                    {isBlocking ? <LoadingSpinner size="sm" /> : `${amIBlock?"unBlock":"Block"}`}
                </button>)
}  
                
            </div>
        </Link>
        

    )
}
export default FollowerCard