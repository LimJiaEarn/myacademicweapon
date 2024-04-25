const PrivacyPolicyPage = () => {
    const sectionHeaderStyles = "text-pri_navy_dark text-lg md:text-xl font-semibold my-4";
    const sectionParaStyles = "text-base text-pri_navy_lighter leading-relaxed";

    return (
        <main className="flex flex-col items-center justify-center p-4 bg-pri_bg_color text-pri_navy_main">

            <h1 className="text-2xl md:text-4xl font-bold text-pri_navy_darker mb-10">
                Our Privacy Policy
            </h1>

            <section className="w-full max-w-4xl mb-6 p-4 bg-pri_bg_card rounded-lg">
                <h2 className={sectionHeaderStyles}>
                    Introduction
                </h2>
                <p className={sectionParaStyles}>
                    Welcome to myacademicweapon.com, a personal project created to offer free access to academic practice papers and allow students to track their academic progress. This Privacy Policy outlines how we collect, use, protect, and handle your personal information when you use our website.
                </p>
            </section>

            <section className="w-full max-w-4xl mb-6 p-4 bg-pri_bg_card rounded-lg">
                <h2 className={sectionHeaderStyles}>
                    Collection and Use of Your Personal Information
                </h2>
                
                <div className="space-y-4">
                    <div>
                        <h3 className="font-semibold text-pri_navy_dark">Registered Users</h3>
                        <p className={sectionParaStyles}>
                            To access enhanced features of the website, such as tracking your academic progress, scoring, and bookmarking papers, you may choose to create an account. When you register for an account, we collect the following information:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li className={sectionParaStyles}>
                                <span className="font-semibold">Email Address and Name:</span> The most basic information we need to uniquely identify you and your account details (e.g., bookmarks).
                            </li>
                            <li className={sectionParaStyles}>
                                <span className="font-semibold">Profile Picture:</span> If you signed up via Google, we get this by default to make your profile feel more personalized! You can remove it in account settings.
                            </li>
                            <li className={sectionParaStyles}>
                                <span className="font-semibold">School and Level:</span> This is optional and must be explicitly given by you. It helps us better understand our audience and prioritize our limited efforts in providing relevant resources.
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-pri_navy_dark">Non-Registered Users</h3>
                        <p className={sectionParaStyles}>No personal information is collected.</p>
                    </div>
                </div>
            </section>

            <section className="w-full max-w-4xl mb-6 p-4 bg-pri_bg_card rounded-lg">
                <h2 className={sectionHeaderStyles}>
                    Data Storage and Security
                </h2>
                <p className={sectionParaStyles}>
                    All personal data are stored securely in services provided by Clerk and MongoDB Atlas which have comprehensive security measures to protect your data. These include network isolation and encryption, among others, ensuring the highest standards of data security.
                </p>
            </section>

            <section className="w-full max-w-4xl mb-6 p-4 bg-pri_bg_card rounded-lg">
                <h2 className={sectionHeaderStyles}>
                    Cookies and Session Management
                </h2>
                <p className={sectionParaStyles}>
                    We use cookies to maintain your login sessions, keeping you logged in on your signed-in devices as you navigate the website. This enhances your experience by eliminating your need to repeatedly log in.
                </p>
            </section>

            <section className="w-full max-w-4xl mb-6 p-4 bg-pri_bg_card rounded-lg">
                <h2 className={sectionHeaderStyles}>
                    Changes to Privacy Policy
                </h2>
                <p className={sectionParaStyles}>
                    Any changes will be posted on this page, and we encourage you to review it frequently to stay informed.
                </p>
            </section>

            <section className="w-full max-w-4xl mb-6 p-4 bg-pri_bg_card rounded-lg">
                <h2 className={sectionHeaderStyles}>
                    Contact Us
                </h2>
                <p className={sectionParaStyles}>
                    If you have any questions or concerns about this Privacy Policy or your personal data,<br/>
                    please contact us at: myacademicweapon@gmail.com
                </p>
            </section>

        </main>
    )
}

export default PrivacyPolicyPage;
