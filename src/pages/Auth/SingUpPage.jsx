import { Link } from "react-router-dom";
import { useState } from "react";

import XSvg from "../../components/svg/X.jsx";
import {QueryClient, useMutation, useQueryClient} from "@tanstack/react-query"
import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import toast from "react-hot-toast";
import { mainApi } from "../../utils/api.js";

const SingUpPage = () => {
	const queryClient = useQueryClient();
	const [formData, setFormData] = useState({
		email: "",
		username: "",
		fullName: "",
		password: "",
	});
	const {mutate,isError,isPending,error} = useMutation({
		mutationFn:async({email,username,fullName,password})=>{
			try {
				const res = await fetch(`${mainApi}api/auth/singup`,{
					method: "POST",
					headers:{
						"Content-Type": "application/json",
						"auth-token":localStorage.getItem("token"),
					},
					body:JSON.stringify({email,username,fullName,password}),
				})
				const data = await res.json();
				if(data.token){
					localStorage.setItem("token",data.token);
				}
				if(!res.ok) throw new Error(data.error);
				if(data.error) throw new Error(data.error);
				return data;
			} catch (error) {
				console.log(error)
				throw error;
			}
		},
		onSuccess:()=>{
			

				toast.success("Account successfully created");
				queryClient.invalidateQueries({ queryKey: ["authUser"] });
			
		},
		onError:(error)=>{
			toast.error(error.message);
		}

	});

	const handleSubmit = (e) => {
		e.preventDefault();
		mutate(formData);
	};
	
	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	

	return (
		<div className='max-w-screen-xl mx-auto flex h-screen px-10'>
			<div className='flex-1 hidden lg:flex lg:items-center  lg:justify-center'>
				<XSvg className=' lg:w-2/3 fill-white' />
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col' onSubmit={handleSubmit}>
					<XSvg className='w-24 lg:hidden mx-auto fill-white' />
					<h1 className='text-4xl font-extrabold mx-auto text-white'>Join today.</h1>
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdOutlineMail />
						<input
							type='email'
							className='grow'
							placeholder='Email'
							name='email'
							onChange={handleInputChange}
							value={formData.email}
						/>
					</label>
					<div className='flex gap-4 flex-wrap'>
						<label className='input input-bordered rounded flex items-center gap-2 flex-1'>
							<FaUser />
							<input
								type='text'
								className='grow '
								placeholder='Username'
								name='username'
								onChange={handleInputChange}
								value={formData.username}
							/>
						</label>
						<label className='input input-bordered rounded flex items-center gap-2 flex-1'>
							<MdDriveFileRenameOutline />
							<input
								type='text'
								className='grow'
								placeholder='Full Name'
								name='fullName'
								onChange={handleInputChange}
								value={formData.fullName}
							/>
						</label>
					</div>
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdPassword />
						<input
							type='password'
							className='grow'
							placeholder='Password'
							name='password'
							onChange={handleInputChange}
							value={formData.password}
						/>
					</label>
					<button className='btn rounded-full btn-primary text-white'>{
						isPending?"Loading...":"Singup"
					}</button>
					{isError && <p className='text-red-500'>{error.message}</p>}
				</form>
				<div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
					<p className='text-white text-lg'>Already have an account?</p>
					<Link to='/login'>
						<button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign in</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default SingUpPage;