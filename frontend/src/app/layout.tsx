import AppHeader from '@/components/Header/AppHeader';
import AppFooter from '@/components/Footer/AppFooter';
import { AuthProvider } from '@/app/authContext/page'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Website trao đổi sách CTU</title>
      </head>
      <body>
        <AuthProvider>
          <AppHeader />
          {children}
          <AppFooter />
        </AuthProvider>
      </body>
    </html>
  );
}
