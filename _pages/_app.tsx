import '/lib/styles/index.scss'
import "swiper/css";
import { Layout } from '/components';
import { PageProvider } from '/lib/context/page'
import { DefaultDatoSEO } from 'dato-nextjs-utils/components';
import { useEffect } from 'react';
import useStore from '/lib/store';

function App({ Component, pageProps, router }) {

  const page = pageProps.page || {} as PageProps
  const { site } = pageProps
  const description = site?.globalSeo?.fallbackSeo.description
  const errorCode = parseInt(router.pathname.replace('/', ''))
  const isError = (!isNaN(errorCode) && (errorCode > 400 && errorCode < 600)) || router.pathname.replace('/', '') === '_error'
  const [setIsHome] = useStore((s) => [s.setIsHome])

  useEffect(() => setIsHome(router.pathname === '/'), [router.pathname])

  if (isError) return <Component {...pageProps} />

  return (
    <>
      <DefaultDatoSEO siteTitle={'Amy Simon'} site={site} description={description} />
      <PageProvider value={{ ...page }} key={router.locale}>
        <Layout title={page?.title}>
          <Component {...pageProps} />
        </Layout>
      </PageProvider>
    </>
  );
}

export default App;
