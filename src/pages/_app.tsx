import { AppProps } from "next/app";
import { DataProvider } from "../DataContext";

import '../styles/global.scss';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <DataProvider>
      <Component {...pageProps} />
    </DataProvider>
  )
}
