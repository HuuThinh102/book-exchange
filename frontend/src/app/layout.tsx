import AppHeader from '@/components/Header/AppHeader';
import AppFooter from '@/components/Footer/AppFooter';
import { AuthProvider } from '@/app/authContext/page'
import { BookProvider } from '@/app/bookContext/page';
import { ChatProvider } from './chatContext/page';

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
          <BookProvider>
            <ChatProvider>
              <AppHeader />
              {children}
              <AppFooter />
            </ChatProvider>
          </BookProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
