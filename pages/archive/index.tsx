import s from "./index.module.scss";
import cn from 'classnames'
import withGlobalProps from "/lib/withGlobalProps";
import { AllCollectionsDocument } from "/graphql";
import Link from "next/link";
import { Image } from "react-datocms/image";
import { useState, useRef } from "react";

export type Props = {
  collections: CollectionRecord[]

}

export default function Archive({ collections }: Props) {
  const [collectionId, setCollectionId] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timer | null>(null)

  const handleMouseMove = ({ type, target }) => {
    clearTimeout(timeoutRef.current)
    if (type === 'mousemove')
      setCollectionId(target.closest('li').id)
    else {
      timeoutRef.current = setTimeout(() => {
        setCollectionId(null)
      }, 100);
    }
  }

  return (
    <div className={s.container}>
      <ul>
        {collections.map(({ id, title, description, year, artwork }) =>
          <li id={id} key={id} onMouseMove={handleMouseMove} onMouseLeave={handleMouseMove}>
            <h2>{year}</h2>
            <Image
              data={artwork[0].image.responsiveImage}
              className={s.image}
              fadeInDuration={100}
              pictureClassName={cn(s.picture, id === collectionId || collectionId === null ? s.active : s.inactive)}
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