import StudyBreadcrumbs from '@/components/shared/StudyBreadcrumbs';
import StudyResourceDataLoader from '@/components/shared/StudyResourceDataLoader';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

function paramsMap(str : string) : string{

  switch(str){
    case 'secondary':
      return 'Secondary';
    case 'jc':
      return 'JC';
  
    default:
      return 'Invalid';
    }


}

type Props = {
  params: Promise<{ level: string }>
  searchParams: Promise<{ [key: string]: string }>
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {

    const [{ level: levelParam }, resolvedSearchParams] = await Promise.all([params, searchParams]);
    const level = paramsMap(levelParam)

    if (level === "Invalid") {
      return { title: "Resources Not Found", robots: { index: false } };
    }

    const exam = levelParam === "jc" ? "A-Level" : "O-Level";
    const subject = resolvedSearchParams.subject;
    // Filters share one dataset — point every variant at the clean level URL.
    const canonical = `/study-resources/${levelParam}`;

    return {
      title: subject
        ? `${level} ${subject} Practice Papers & Notes`
        : `${level} Resources`,
      description: subject
        ? `Free ${level} ${subject} resources for Singapore students — ${exam} prelim papers, topical practice papers and study notes.`
        : `Free ${level} study resources — ${exam} prelim papers, topical practice papers and study notes for Singapore students.`,
      alternates: { canonical },
      openGraph: { url: canonical },
    };
}


const StudyResourcePage = async ( {params, searchParams} : {params: Promise<{ level: string }>, searchParams: Promise<{ [key:string]:string}>} ) => {

    const [{ level: levelParam }, resolvedSearchParams] = await Promise.all([params, searchParams]);

    // Get the encoded data from url
    const resourceLevel = paramsMap(levelParam);

    const resourceSubject = resolvedSearchParams.subject;
    const resourceType = resolvedSearchParams.resourceType?.split(' ')[0];

    const typeLabel =
      resourceType === "Yearly" ? "Yearly Papers"
      : resourceType === "Topical" ? "Topical Papers"
      : resourceType === "Notes" ? "Study Notes"
      : "Study Resources";

    return (

        <div className="min-h-screen w-full">

          {/* ── Hero header ─────────────────────────────────────────── */}
          <header className="relative overflow-hidden border-b border-hairline">
            <div className="pointer-events-none absolute inset-0 hero-glow opacity-70" aria-hidden />
            <div className="relative mx-auto max-w-[1500px] px-4 md:px-8 py-6 md:py-9 reveal">
              <p className="eyebrow text-pri_mint_darker">{typeLabel}</p>
              <h1 className="mt-1.5 font-display text-[2rem] md:text-5xl font-extrabold leading-[1.05] tracking-tight text-ink">
                {resourceSubject ? (
                  <>
                    {resourceLevel}{" "}
                    <span className="text-pri_mint_main">·</span>{" "}
                    <span className="mint_grad_text">{resourceSubject}</span>
                  </>
                ) : (
                  <>{resourceLevel} Resources</>
                )}
              </h1>
              <p className="mt-2 max-w-2xl text-sm md:text-base text-ink_soft">
                Practice papers, notes &amp; video walkthroughs — open them in one tap,
                bookmark for later, and tick off what you&apos;ve done.
              </p>

              <div className="mt-4">
                <StudyBreadcrumbs
                  level={levelParam}
                  subject={resourceSubject}
                  resourceType={resolvedSearchParams.resourceType}
                />
              </div>
            </div>
          </header>

          <div className="py-5 md:py-7">
            <Suspense fallback={
              <div className="w-full flex_center gap-4 py-12">
                <Loader2 className="h-8 w-8 animate-spin text-pri_mint_main" />
                <p className="text-center text-ink_soft">Loading resources…</p>
              </div>
            }>
              <StudyResourceDataLoader
                resourceLevel={resourceLevel}
                resourceSubject={resourceSubject}
                resourceType={resourceType}
                searchParams={resolvedSearchParams}
              />
            </Suspense>
          </div>

      </div>


    )
  }

export default StudyResourcePage