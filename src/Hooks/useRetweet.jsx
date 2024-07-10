import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { mainApi } from "../utils/api";


const useRetweet = () => {
    const queryClient = useQueryClient();
    const {mutate:Retweet,isPending:isRetweeting}  = useMutation({
        mutationFn:async (postId)=>{
            try {
                const res = await fetch(`${mainApi}api/post/retweet/${postId}`,{
                    method: 'POST',
                    headers:{
                        "Content-Type": "application/json",
                        "auth-token":localStorage.getItem("token"),
                    },
                    
                });
                const data = await res.json();
                if(!res.ok) throw new Error(data.error || "Something went wrong");
                return data;
    
    
            } catch (error) {
                throw new Error(error.message);
            }
        },
        onSuccess:(data)=>{
            
                toast.success(data.message);
                queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
        onError:()=>{
            toast.error(error.message);
        }
    })
    return {Retweet,isRetweeting};
}

export default useRetweet