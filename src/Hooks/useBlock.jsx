import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { mainApi } from "../utils/api";

const useBlock = () => {
    const queryClient = useQueryClient();


            
    const {mutate:block,isPending} = useMutation({
         mutationFn: async (userId) =>{
             try {
                 const res = await fetch(`${mainApi}api/users/blocked/${userId}`,{
                     method:"PUT",
                     headers:{
                         "Content-Type": "application/json",
                         'auth-token': localStorage.getItem('token'),
                     }
                 });
                 const data = await res.json();
                
                 if(!res.ok) throw new Error(data.error || "Something went wrong");
                 return data;
             } catch (error) {
             throw new Error(error);
             }
         },
         onSuccess:(data)=>{
             toast.success(data.message);
             Promise.all([
                 queryClient.invalidateQueries({ queryKey: ["suggestedUsers"],exact:true }),
                 queryClient.invalidateQueries({ queryKey: ["authUser"],exact:true }),
                 queryClient.invalidateQueries({queryKey:["posts"]}),
             ]);
         
         },
         onError:(error)=>{
             toast.error(error.message);
         },
    });
 
 
 
    return {block,isPending};
}

export default useBlock