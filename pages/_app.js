import "@/styles/globals.css";
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Toaster position="top-center" />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
