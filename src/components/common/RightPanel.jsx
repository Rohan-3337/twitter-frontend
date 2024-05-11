import { Link } from "react-router-dom";
import { USERS_FOR_RIGHT_PANEL } from "../../utils/dummy";
import RightPanelSkeleton from "../skeleton/RightPanelSkeleton";
import { useQuery } from "@tanstack/react-query";

import SuggestedCard from "./SuggestedCard";

const RightPanel = () => {

	const { data: suggestedUsers, isLoading } = useQuery({
		queryKey: ["suggestedUsers"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/users/suggested");
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong!");
				}
				return data;
			} catch (error) {
				throw new Error(error.message);
			}
		},
	});


 
	if(suggestedUsers?.length ===0) return( 
		<div className="md:w-64 w-0">

		</div>
	)
	return (
		<div className='hidden md:block my-4 mx-2'>
			<div className='bg-[#16181C] p-4 rounded-md sticky top-2'>
				<p className='font-bold'>Who to follow</p>
				<div className='flex flex-col gap-4'>
					{/* item */}
					{isLoading && (
						<>
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
                        
						</>
					)}
					{!isLoading && suggestedUsers &&
						suggestedUsers?.map((user) => (
							<SuggestedCard user={user} key={user?._id}/>
						))}
				</div>
			</div>
		</div>
	);
};
export default RightPanel;