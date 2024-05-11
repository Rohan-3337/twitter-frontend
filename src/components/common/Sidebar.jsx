import XSvg from "../svg/X.jsx";

import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import {  useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { mainApi } from "../../utils/api.js";

const Sidebar = () => {
	const queryClient = useQueryClient();
	const { mutate: logout } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch(`${mainApi}api/auth/logout`, {
					method: "POST",
				});
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
		onError: () => {
			toast.error("Logout failed");
		},
	});
	const {data} = useQuery({queryKey: ["authUser"]});
	

	
	
	
	const options = [{name:"Home",icon:<MdHomeFilled className="w-8 h-8"/>,link:"/"},{name:"Notifications",icon:<IoNotifications className="w-8 h-8"/>,link:"/notifications"},{name:"Profile",icon:<FaUser className=" w-8 h-8"/>,link:`/profile/${data?._id}`}];

	return (
		<div className='md:flex-[2_2_0] w-18 max-w-52'>
			<div className='sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full'>
				<Link to='/' className='flex justify-center md:justify-start'>
					<XSvg className='px-2 w-12 h-12 rounded-full fill-white hover:bg-stone-900' />
				</Link>
				<ul className='flex flex-col mt-4'>
					
					{options.map((option,i)=>(
						<li className='flex justify-center md:justify-start px-4 py-2' key={i}>
						<Link
							to={option.link}
							className='flex gap-3 items-center hover:bg-primary  transition-all rounded-full duration-300 p-4 hover:px-4 w-[100%] cursor-pointer'
						>
							{option.icon}
							<span className='text-lg hidden md:block'>{option.name}</span>
						</Link>
					</li>
					))}


				</ul>
				{data && (
					<Link
						to={`/profile/${data._id}`}
						className='mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-primary py-2 px-4 rounded-full'
					>
						<div className='avatar hidden md:inline-flex'>
							<div className='w-8 rounded-full'>
								<img src={data?.profileImg || "/avatar-placeholder.png"} />
							</div>
						</div>
						<div className='flex justify-between flex-1'>
							<div className='hidden md:block hover:text-white'>
								<p className='text-white font-bold text-sm w-20 truncate'>{data?.fullName}</p>
								<p className='text-white hover:text-white text-sm'>@{data?.username}</p>
							</div>
							<BiLogOut className='w-5 h-5 cursor-pointer' onClick={(e)=>{e.preventDefault();logout()}}/>
						</div>
					</Link>
				)}
			</div>
		</div>
	);
};
export default Sidebar;