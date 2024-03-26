import { SignIn } from "@clerk/nextjs"


const Page = () => {
  return (
   <section className="flex_center pt-6 min-h-screen">
    <SignIn/>
   </section>
  )
}

export default Page