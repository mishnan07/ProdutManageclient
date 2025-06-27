import localFont from "next/font/local";
import "./globals.css";
import "./commenStyle.css";
import 'toastr/build/toastr.min.css';
import { Pacifico } from 'next/font/google';

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pacifico',
});

export const metadata = {
  title: "Welcome Page | YourApp",
  description: "This is the welcome page of our app.",
  icons: {
    icon: "https://seclobsuperapplication.s3.ap-south-1.amazonaws.com/segments/1741175879706-XNRMtjBPbI.png", // default 32x32
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png", // optional: 180x180 for Apple
  },
  openGraph: {
    title: "WWWWWWWWWW | EEEEEEEEEEEEEE",
    description: "This is the welcome page of our app.",
    type: "website",
    url: "https://produt-manageclient.vercel.app/vcard",
    images: [
      {
        url: "https://seclobsuperapplication.s3.ap-south-1.amazonaws.com/segments/1741175879706-XNRMtjBPbI.png",
        width: 1200,
        height: 630,
        alt: "Welcome Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Welcome Page | YourApp",
    description: "This is the welcome page of our app.",
    images: [
      "https://seclobsuperapplication.s3.ap-south-1.amazonaws.com/segments/1741175879706-XNRMtjBPbI.png",
    ],
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${pacifico.variable} antialiased`} style={{ fontFamily: 'var(--font-pacifico)' }}>
        {children}
      </body>
    </html>
  );
}
