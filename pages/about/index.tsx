import s from "./index.module.scss";
import withGlobalProps from "/lib/withGlobalProps";
import { AboutDocument } from "/graphql";
import Link from "next/link";

export type Props = {
  about: AboutRecord
}

export default function About({ about }: Props) {

  return (
    <div className={s.container}>
      About
    </div>
  );
}

export const getStaticProps = withGlobalProps({ queries: [AboutDocument] }, async ({ props, revalidate }: any) => {

  return {
    props: {
      ...props,
      page: {
        title: 'About'
      }
    },
    revalidate
  };
});