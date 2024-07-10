import Post from "./Post";
import PostSkeleton from "../skeleton/PostSkeleton.jsx";
import { POSTS } from "../../utils/dummy.js";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { mainApi } from "../../utils/api.js";
import Retweet from "./Retweet.jsx";
const Posts = ({feedtype,userId}) => {
	
	const getEndPoint = () =>{
		switch (feedtype) {
			case "foryou":
				return `${mainApi}api/post/all`
			case "following":
				return `${mainApi}api/post/following`
			case "posts":
				return `${mainApi}api/post/user/${userId}`;
			case "likes":
				return `${mainApi}api/post/likepost/${userId}`;
			case "bookmark":
				return `${mainApi}api/users/get-save`;
			default: 
				return `${mainApi}api/post/all`
		}
	}
	const Post_ENDPOINT = getEndPoint();
	const {data:posts,isLoading,refetch,isRefetching} = useQuery({
		queryKey:["posts"],
		queryFn:async()=>{
			try {
				const res = await fetch(Post_ENDPOINT,{
					method:"GET",
					headers:{
						"Content-Type": "application/json",
						'auth-token': localStorage.getItem('token'),
					}
				});
				const data = await res.json();
				if(res.status===403){
					return null;
				}
				if(!res.ok) throw new Error(data.error);
				console.log(data);
				const post =data.post || data.followingFeed || data.likedPosts || data.savePosts;
				
				return post;
			} catch (error) {
				throw new Error(error.message);
			}
		}
	});
	useEffect(()=>{
		refetch();
	},[feedtype,refetch,userId])
	return (
		<>
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />

				</div>
			)}
			{!isLoading && !isRefetching&& posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading&& !isRefetching && posts && (
				<div>
					{posts.map((post) => {
                        
						if (post.type === 'post') {
                            return <Post key={post._id} post={post} />;
                        }
                        if(post.type ==="retweet"){
							return <Retweet key={post._id} post={post} />;
						}

                        
                       
                        
                    })}
					

				</div>
			)}
		</>
	);
};
export default Posts;