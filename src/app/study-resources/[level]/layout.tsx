export default function StudyResourcesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="w-full px-2 md:px-8 lg:px-10 flex_col_center max-w-[1500px] mx-auto">
      {children}
    </div>
  );
}
