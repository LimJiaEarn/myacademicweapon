import { footerLinks } from "../../../constants"

const Footer = () => {
  return (
    <div className="flex_col_center md:flex_center bg-soft_sky_blue mt-10">
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