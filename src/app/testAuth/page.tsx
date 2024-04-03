import { auth } from '@clerk/nextjs';
 
export default function Page() {
    const { userId } : { userId: string | null } = auth();

    return(
        
        <div>{userId}</div>
    )

}