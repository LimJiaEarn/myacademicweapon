

export default function StudyResourcesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

      <div className="">
        
        
        <p className="text-9xl text-warm_beige">
          Test Words
        </p>

        {children}
      </div>

    
  );
}
