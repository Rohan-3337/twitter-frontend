import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Posts from "../../components/common/Posts";

import EditProfileModal from "./EditProfileModal";


import { CiMenuKebab } from "react-icons/ci";

import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import ProfileHeaderSkeleton from "../../components/skeleton/ProfileHeaderSkeleton.jsx";
import {  useQuery } from "@tanstack/react-query";
import { formatMemberSinceDate } from "../../utils/date/index.js";
import useFollow from "../../Hooks/useFollow.jsx"

import useUpdateProfile from "../../Hooks/useUpdateProfile.jsx";
import { mainApi } from "../../utils/api.js";
import useBlock from "../../Hooks/useBlock.jsx";

const ProfilePage = () => {
	const [coverImg, setCoverImg] = useState(null);
	const [profileImg, setProfileImg] = useState(null);
	const [feedType, setFeedType] = useState("posts");
	const {follow,isPending} = useFollow();
	const {block,isPending:isblocking} =useBlock();
	const coverImgRef = useRef(null);
	const profileImgRef = useRef(null);

	const {data:authUser} =useQuery({queryKey:["authUser"]});

	
	const {id} = useParams();
	// const isLoading = false;
	const isMyProfile = id === authUser._id;
	const {
		data: user,
		isLoading,
		refetch,
		isRefetching,
	} = useQuery({
		queryKey: ["userProfile"],
		queryFn: async () => {
			try {
				const res = await fetch(`${mainApi}api/users/profile/${id}`,{
					method: "GET",
					headers:{
						"Content-Type": "application/json",
						'auth-token': localStorage.getItem('token'),
					}
				});
				const data = await res.json();
				if(res.status===403){
					return null;
				}
				if (!res.ok) {
					
					throw new Error(data.error || "Something went wrong");
				}
				const {user} = data;
				return user;
			} catch (error) {
				throw new Error(error);
			}
		},
	});

	//update profile functionality
	const { isupdating, updateProfile } = useUpdateProfile();

	const handleImgChange = (e, state) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				state === "coverImg" && setCoverImg(reader.result);
				state === "profileImg" && setProfileImg(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};
	

	
	

	useEffect(()=>{
		refetch();
	},[refetch,id]);

	return (
		<>
			<div className='flex-[4_4_0]  border-r border-gray-700 min-h-screen '>
				{/* HEADER */}
				{isLoading ||isRefetching || isblocking && <ProfileHeaderSkeleton />}
                
				{!isLoading && !isRefetching &&  !user && <p className='text-center text-lg mt-4'>User not found</p>}
				<div className='flex flex-col'>
					{!isLoading &&!isRefetching&& !isblocking&& user && (
						<>
							<div className='flex gap-10 px-4 py-2 items-center justify-between'>
								<Link to='/'>
									<FaArrowLeft className='w-4 h-4' />
								</Link>
								<div className='flex flex-col'>
									<p className='font-bold text-lg'>{user?.fullName}</p>
									<span className='text-sm text-slate-500'>{user.postLength} posts</span>
								</div>
								<div className='dropdown '>
						<div tabIndex={0} role='button' className='m-1'>
							<CiMenuKebab className="w-4"/>
						</div>
						<ul
							tabIndex={0}
							className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'
						>
							<li>
								<a onClick={()=> block(user?._id)}>Block user</a>
							</li>
						</ul>
					</div>
							</div>
							{/* COVER IMG */}
							<div className='relative group/cover'>
								<img
									src={coverImg || user?.coverImg || "/cover.png"}
									className='h-52 w-full object-cover'
									alt='cover image'
								/>
								{isMyProfile && (
									<div
										className='absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200'
										onClick={() => coverImgRef.current.click()}
									>
										<MdEdit className='w-5 h-5 text-white' />
									</div>
								)}

								<input
									type='file'
									hidden
									ref={coverImgRef}
									onChange={(e) => handleImgChange(e, "coverImg")}
								/>
								<input
									type='file'
									hidden
									ref={profileImgRef}
									onChange={(e) => handleImgChange(e, "profileImg")}
								/>
								{/* USER AVATAR */}
								<div className='avatar absolute -bottom-16 left-4'>
									<div className='w-32 rounded-full relative group/avatar'>
										<img src={profileImg || user?.profileImg || "/avatar-placeholder.png"} />
										<div className='absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer'>
											{isMyProfile && (
												<MdEdit
													className='w-4 h-4 text-white'
													onClick={() => profileImgRef.current.click()}
												/>
											)}
										</div>
									</div>
								</div>
							</div>
							<div className='flex justify-end px-4 mt-5'>
								{isMyProfile && <EditProfileModal authUser={authUser} />}
								{!isMyProfile && (
									<button
										className='btn btn-outline rounded-full btn-sm'
										onClick={()=>follow(user?._id)}
									>
										{isPending && "Loading..."}

										{!isPending && authUser?.following.includes(user?._id) && "Unfollow"}
										{!isPending && !authUser?.following.includes(user?._id) && "Follow"}
									</button>
								)}
								{(coverImg || profileImg) &&(isMyProfile) && (
									<button
										className='btn btn-primary rounded-full btn-sm text-white px-4 ml-2'
										onClick={async() =>{ await updateProfile({coverImg,profileImg});
									setCoverImg(null);
								setProfileImg(null);}}
									>
										{isupdating?"updating...":"update"}
									</button>
								)}
							</div>

							<div className='flex flex-col gap-4 mt-14 px-4'>
								<div className='flex flex-col'>
									<span className='font-bold text-lg'>{user?.fullName}</span>
									<span className='text-sm text-slate-500'>@{user?.username}</span>
									<span className='text-sm my-1'>{user?.bio}</span>
								</div>

								<div className='flex gap-2 flex-wrap'>
									{user?.link && (
										<div className='flex gap-1 items-center '>
											<>
												<FaLink className='w-3 h-3 text-slate-500' />
												<a
													href={user?.link}
													target='_blank'
													rel='noreferrer'
													className='text-sm text-blue-500 hover:underline'
												>
													{user.link}
												</a>
											</>
										</div>
									)}
									<div className='flex gap-2 items-center'>
										<IoCalendarOutline className='w-4 h-4 text-slate-500' />
										<span className='text-sm text-slate-500'>{formatMemberSinceDate(user?.createdAt)}</span>
									</div>
								</div>
								<div className='flex gap-2'>
									<Link className='flex gap-1 items-center' to={`/followers/${user?._id}`}>
										<span className='font-bold text-xs'>{user?.followers.length}</span>
										<span className='text-slate-500 text-xs'>Followers</span>
									</Link>
									<Link className='flex gap-1 items-center' to={`/following/${user?._id}`}>
										<span className='font-bold text-xs'>{user?.following.length}</span>
										<span className='text-slate-500 text-xs'>Following</span>
									</Link>
								</div>
							</div>
							<div className='flex w-full border-b border-gray-700 mt-4'>
								<div
									className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer'
									onClick={() => setFeedType("posts")}
								>
									Posts
									{feedType === "posts" && (
										<div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary' />
									)}
								</div>
								<div
									className='flex justify-center flex-1 p-3 text-slate-500 hover:bg-secondary transition duration-300 relative cursor-pointer'
									onClick={() => setFeedType("likes")}
								>
									Likes
									{feedType === "likes" && (
										<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary' />
									)}
								</div>
							</div>
						</>
					)}

					<Posts feedtype={feedType} userId={id}/>
				</div>
			</div>
		</>
	);
};
export default ProfilePage;