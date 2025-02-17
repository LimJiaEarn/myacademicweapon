import { SignIn } from "@clerk/nextjs"


const Page = () => {
  return (
   <section className="flex_center min-h-screen">
      <SignIn 
        appearance={{
          elements: {
            formButtonPrimary: 'bg-pri_navy_light hover:bg-pri_navy_light/80',
          },
        }}
      />
   </section>
  )
}

export default Page