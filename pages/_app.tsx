import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from 'react-query';
import "public/static/scss/GlobalStyleSheet.scss"
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
const queryClient = new QueryClient();


export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnHover
      />
    </QueryClientProvider>
  );
}