// pages/_app.tsx
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <Component {...pageProps} />
    </GoogleOAuthProvider>
  );
}
