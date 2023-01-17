import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';
//import 'antd/dist/antd.css';
export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Head>
        <title>MetaMail</title>
      </Head>
      <Component {...pageProps} />
    </div>
  );
}
