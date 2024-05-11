

import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Sidebar from "./components/common/Sidebar.jsx"
import './App.css'
import LoginPage from './pages/Auth/LoginPage';
import SingUpPage from './pages/Auth/SingUpPage';
import HomePage from './pages/Home/HomePage.jsx';
import RightPanel from './components/common/RightPanel.jsx';
import NotificationPage from './pages/notification/NotificationPage.jsx';
import ProfilePage from "./pages/Profile/ProfilePage.jsx"
import toast, { ToastBar, Toaster } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from './components/common/LoadingSpinner.jsx';
import { useEffect } from 'react';


function App() {
	const navigate = useNavigate();
	const {data:authUser,isLoading,isError,error} = useQuery({
		queryKey:['authUser'],
		queryFn:async ()=>{
			try {
				const res = await fetch('/api/auth/myprofile');
				const data = await res.json();
				if(data.error) return null;
				if(!res.ok) throw new Error(data.error || "Something went wrong");
				const {user} =data;
				return user;
			} catch (error) {
				throw new Error(error);
			}
		},
		
		retry:false,
		 
	})
	useEffect(()=>{
		console.log(authUser);
	},[authUser])
	if(isLoading){
		return(
			<div className="h-[100vh] flex justify-center items-center">
				<LoadingSpinner size='lg'/>
			</div>
		)
	}
	return (
		<div className='flex max-w-6xl mx-auto'>
				{authUser &&<Sidebar/>}
			<Routes>
				<Route path='/' element={authUser?<HomePage />:<Navigate to={"/login"}/>} />
        
				<Route path='/singup' element={!authUser?<SingUpPage />:<Navigate to={"/"}/>} />
				<Route path='/login' element={!authUser?<LoginPage />:<Navigate to={"/"}/>} />
				<Route path='/notifications' element={authUser?<NotificationPage/>:<Navigate to={"/login"}/>}/>
				<Route path='/profile/:id' element={authUser? <ProfilePage/>:<Navigate to={"/login"}/>}/>
			</Routes>
			{authUser &&<RightPanel/>}
			<Toaster/>
		
			
		</div>
	);
}

export default App
