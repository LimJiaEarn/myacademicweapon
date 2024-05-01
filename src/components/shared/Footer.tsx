import { mostPopularLinks, contributeLinks, socialLinks } from '../../../constants';
import Image from 'next/image';
import Link from 'next/link';

// Inspiration:
// https://www.google.com/search?sca_esv=3e9dc9b55742d0c1&sca_upv=1&rlz=1C1GCEU_enSG1092SG1093&sxsrf=ACQVn08Z7JHmkhtYQsH-1Pi_k8SJ29wkuw:1714117284325&q=website+footer+inspiration&uds=AMwkrPsZszVergVy6YXnPhyY71BcgA0sSW53l__hTBPDve7TMwuq0h-8yx5tbTzb5aXdUNGjxRzwT5DYZU8weYZZt1XRfqQu3g9XQlh-vv3nSZ5mI6f5mMXiW4fM8cH-_ByOBJd8RewZFhFAn4mzAcSKEyhaam_F6TcuTbGZHC_V-bv12D_UBYJFRGbr40JbxhXCO8fPrbHZdnwQCKMi1YDjZX-NOSzbRjoU1pIzuzvUaP8YXkDfA2pMpESuSDoz6U3tcfi1dBgD1Quouj03zLb6eLFDDkuw1lVD8UVdYD1mc8i4wLWD-oEbUOtjRL2gqFehZpcZOaL_&udm=2&prmd=isvnmbtz&sa=X&ved=2ahUKEwiWm9e-sN-FAxWASGwGHU7lCvcQtKgLegQIEhAB&biw=1536&bih=776&dpr=1.25#vhid=ZbpviqUBCemn2M&vssid=mosaic
const Footer = () => {
  return (
    // Hidden in small devices as Navbar will be at bottom replacing footer
    <footer className="hidden min-w-screen-* sm:flex_col_center bg-pri_bg_card2 py-10 px-2 md:px-4">
      
      <div className="w-full flex items-start justify-evenly gap-10 md:gap-20">

        {/* Most Popular Links */}
        <div className="flex_col_center gap-4 md:gap-6">
          <p className="font-semibold text-left text-base w-full text-pri_navy_light">Most Popular Resources</p>
          <ul>
          {mostPopularLinks.map((mostPopularLink) => (
              <li key={mostPopularLink.id} className="flex items-center mb-3 text-left">
                  <Link href={mostPopularLink.link} className="text-left text-sm text-pri_navy_main hover:underline hover:text-pri_mint_main">
                    {mostPopularLink.title}
                  </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contribute Links */}
        <div className="flex_col_center gap-4 md:gap-6">
          <p className="font-semibold text-left text-base w-full text-pri_navy_light">Be a Contributor</p>
          <ul>
          {contributeLinks.map((contributeLink) => (
              <li key={contributeLink.id} className="flex items-center mb-3 text-left">
                  <Link href={contributeLink.link} className="text-left text-sm text-pri_navy_main hover:underline hover:text-pri_mint_main">
                    {contributeLink.title}
                  </Link>
              </li>
            ))}
          </ul>
        </div>



        {/* Social Links */}
        {/* <div className="flex_col_center gap-4 md:gap-6">
          <p className="font-semibold text-left text-base w-full text-pri_navy_light">Follow Us</p>
          <ul>
          {socialLinks.map((socialLink) => (
              <li key={socialLink.id} className="flex items-center justify-start gap-2 mb-3 text-left">
                <Image src={socialLink.icon} alt={`${socialLink.social} icon`} width={20} height={20}/>
                <a href={socialLink.link} target="_blank" rel="noopener noreferrer" className="text-left text-sm text-pri_navy_main hover:underline hover:text-pri_mint_main">
                  {socialLink.social}
                </a>
              </li>
            ))}
          </ul>
        </div> */}

        {/* Contact Links */}
        <div className="flex_col_center gap-4 md:gap-6">
          <p className="font-bold text-left w-full text-pri_navy_light">Contact Us</p>
          <p className="italic text-sm">myacademicweapon@gmail.com</p>
        </div>
      </div>



        
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        <Link href="/privacypolicy" className="underline text-sm text-left text-pri_navy_main hover:text-pri_mint_main">Privacy Policy</Link>
      </div>

    </footer>
  )
}

export default Footer