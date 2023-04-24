import s from "./index.module.scss";
import withGlobalProps from "/lib/withGlobalProps";
import { AllCollectionsDocument } from "/graphql";
import Link from "next/link";
import { Image } from "react-datocms/image";

export type Props = {
  collections: CollectionRecord[]

}

export default function Archive({ collections }: Props) {

  return (
    <div className={s.container}>
      <ul>
        {collections.map(({ id, title, description, year, artwork }) =>
          <li>
            <h2>{year}</h2>
            <Image
              data={artwork[0].image.responsiveImage}
              className={s.image}
              pictureClassName={s.picture}
            />
          </li>
        )}
      </ul>
    </div>
  );
}

export const getStaticProps = withGlobalProps({ queries: [AllCollectionsDocument] }, async ({ props, revalidate }: any) => {

  return {
    props: {
      ...props,
      page: {
        title: 'Archive'
      }
    },
    revalidate
  };
});