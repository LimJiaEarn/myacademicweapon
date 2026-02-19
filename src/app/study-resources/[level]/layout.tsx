import type { Metadata } from 'next'

type Props = {
  params: Promise<{ level: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  function capitalize(str : string) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const { level: levelParam } = await params;
  const level = capitalize(levelParam);

  return {
    title: `${level} Resources`,
    description: `Our diverse library of ${level} practice papers and study notes`
  }
}


export default function StudyResourcesLayout({ children,}: Readonly<{children: React.ReactNode;}>) {

  return (
    <div className="w-full px-2 md:px-8 lg:px-10 flex_col_center max-w-[1500px] mx-auto">


        

        {children}


      
      
  </div>
  );
}
