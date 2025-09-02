import "@/styles/globals.css";
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <Toaster position="top-center" />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
