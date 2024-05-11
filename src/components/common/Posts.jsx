import Post from "./Post";
import PostSkeleton from "../skeleton/PostSkeleton.jsx";
import { POSTS } from "../../utils/dummy.js";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
const Posts = ({feedtype,userId}) => {
	console.log(feedtype);
	const getEndPoint = () =>{
		switch (feedtype) {
			case "foryou":
				return "api/post/all"
			case "following":
				return "api/post/following"
			case "posts":
				return `/api/post/user/${userId}`;
			case "likes":
				return `/api/post/likepost/${userId}`;
			default: 
				return "api/post/all"
		}
	}
	const Post_ENDPOINT = getEndPoint();
	const {data:posts,isLoading,refetch,isRefetching} = useQuery({
		queryKey:["posts"],
		queryFn:async()=>{
			try {
				const res = await fetch(Post_ENDPOINT);
				const data = await res.json();
				if(res.status===403){
					return null;
				}
				if(!res.ok) throw new Error(data.error);
				const post =data.post || data.followingFeed || data.likedPosts;
				
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
					{posts?.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;