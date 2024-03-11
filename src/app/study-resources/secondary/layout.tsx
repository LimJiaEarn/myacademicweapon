import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Secondary Study Resources",
};

export default function SecondaryResourcesLayout({ children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <div>
        {children}
    </div>
  );
}
