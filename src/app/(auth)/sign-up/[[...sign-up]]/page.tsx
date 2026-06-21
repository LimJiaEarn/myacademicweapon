import type { Metadata } from "next"
import { SignUp } from "@clerk/nextjs"

export const metadata: Metadata = {
  title: "Sign Up",
  robots: { index: false },
}

const Page = () => {
  return (
    <section className="flex_center min-h-screen">
      <SignUp
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