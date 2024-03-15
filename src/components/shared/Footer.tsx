import { footerLinks } from "../../../constants"

const Footer = () => {
  return (
    <div className="fixed bottom-0 right-0 left-0 flex_col_center md:flex_center bg-soft_sky_blue mt-10">
        {footerLinks.map((footerLink) => {
            return(
                <div key={footerLink.id}>
                    {footerLink.label}
                </div>
            )
        })}
    </div>
  )
}

export default Footer