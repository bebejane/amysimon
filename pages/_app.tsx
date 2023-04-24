import '/lib/styles/index.scss'
import "swiper/css";
import { Layout } from '/components';
import { PageProvider } from '/lib/context/page'
import { DefaultDatoSEO } from 'dato-nextjs-utils/components';

const siteTitle = 'Amy Simon'

function App({ Component, pageProps, router }) {

  const page = pageProps.page || {} as PageProps

  const errorCode = parseInt(router.pathname.replace('/', ''))
  const isError = (!isNaN(errorCode) && (errorCode > 400 && errorCode < 600)) || router.pathname.replace('/', '') === '_error'

  if (isError) return <Component {...pageProps} />

  return (
    <>
      <DefaultDatoSEO siteTitle={siteTitle} />
      <PageProvider value={{ ...page }} key={router.locale}>
        <Layout footer={{}} title={page?.title}>
          <Component {...pageProps} />
        </Layout>
      </PageProvider>
    </>
  );
}

export default App;
