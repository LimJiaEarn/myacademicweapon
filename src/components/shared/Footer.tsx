const Footer = () => {
  return (
    // Hidden in small devices as Navbar will be at bottom replacing footer
    <div className="hidden min-w-screen-* sm:flex_col_center md:flex_center bg-soft_sky_blue py-10">
        
      <p className="text-text_gray">| Find an issue on this page ? | Need help ? |</p>
      <p className="text-text_gray">Contact us at <span className="font-bold">myacademicweapon@gmail.com</span> !</p>

    </div>
  )
}

export default Footer