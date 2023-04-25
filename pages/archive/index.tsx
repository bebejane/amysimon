import s from "./index.module.scss";
import cn from 'classnames'
import withGlobalProps from "/lib/withGlobalProps";
import { AllCollectionsDocument } from "/graphql";
import Link from "next/link";
import { Image } from "react-datocms/image";
import { useState, useRef, useEffect } from "react";
import { artworkCaption, sleep } from "/lib/utils";

export type Props = {
  collections: CollectionRecord[]

}

export default function Archive({ collections }: Props) {

  const [collection, setCollection] = useState<CollectionRecord | null>(null);
  const [index, setIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const figureRef = useRef<HTMLDivElement>(null);

  const handleClick = async ({ target }) => {
    const id = target.closest('li').id;

    setTransitioning(true)
    setCollection(collections.find(el => el.id === target.closest('li').id))
    await sleep(100)

    const image = document.getElementById(id).querySelector('picture>img')
    const dImage = figureRef.current.querySelector('picture>img')
    const bounds = image.getBoundingClientRect();
    const dBounds = dImage.getBoundingClientRect();
    console.log(bounds, dBounds)
    setTimeout(() => setTransitioning(false), 1000)
  }

  return (
    <div className={cn(s.container, collection && s[collection.artwork[index].layout])}>
      <ul>
        {collections.map(({ id, title, description, year, artwork }) =>
          <li id={id} key={id} onClick={handleClick}>
            <h2>{year}</h2>
            <Image
              data={artwork[0].image.responsiveImage}
              className={s.image}
              fadeInDuration={100}
              pictureClassName={cn(s.picture, id === collection?.id || collection === null ? s.active : s.inactive)}
            />
          </li>
        )}
      </ul>
      {collection &&
        <figure ref={figureRef} className={cn(transitioning ? s.invisible : s.visible)} onClick={() => setCollection(null)}>
          <Image
            data={collection.artwork[index].image.responsiveImage}
            className={s.image}
            fadeInDuration={0}
            pictureClassName={cn(s.picture)}
          />
          <figcaption>{artworkCaption(collection.artwork[index])}</figcaption>
        </figure>
      }
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