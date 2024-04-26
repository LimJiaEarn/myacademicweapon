import { contributeLinks, socialLinks } from '../../../constants';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  return (
    // Hidden in small devices as Navbar will be at bottom replacing footer
    <footer className="hidden min-w-screen-*  sm:flex_col_center bg-pri_bg_card2 py-10">
      
      <div className="sm:flex sm:flex-col md:flex-row justify-evenly">

        {/* Social Links */}
        <div className="flex_col_center gap-2">
          <p className="font-bold text-pri_navy_light">Follow Us</p>
          <ul>
          {contributeLinks.map((contributeLink) => (
              <li key={contributeLink.id} className="flex items-center gap-2 p-2">
                  <Link href={contributeLink.link} className="text-left text-pri_navy_main hover:text-pri_mint_light">
                    {contributeLink.title}
                  </Link>
              </li>
            ))}
          </ul>
        </div>



        {/* Social Links */}
        <div className="flex_col_center gap-2">
          <p className="font-bold text-pri_navy_light">Follow Us</p>
          <ul>
          {socialLinks.map((socialLink) => (
              <li key={socialLink.id} className="flex items-center gap-2 p-2">
                <Image src={socialLink.icon} alt={`${socialLink.social} icon`} width={20} height={20}/>
                  <a href={socialLink.link} target="_blank" rel="noopener noreferrer" className="text-left text-pri_navy_main hover:text-pri_mint_light">
                    {socialLink.social}
                  </a>
              </li>
            ))}
          </ul>
        </div>
      </div>


      {/* Popular Links */}
      <div className="">
        <p className="font-bold">| Find an issue on this page ? | Need help ? |</p>
        <p className="font-semibold">Contact us at <span className="font-bold">myacademicweapon@gmail.com</span> !</p>
      </div>
        
      <div>
        <Link href="/privacypolicy" className="underline text-sm text-left text-pri_navy_main hover:text-pri_mint_light">Our Privacy Policy</Link>
      </div>

    </footer>
  )
}

export default Footer