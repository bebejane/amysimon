import Document, { Html, Head, Main, NextScript } from 'next/document';
import { useRouter } from 'next/router';

export default class MyDocument extends Document {

  render() {

    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}