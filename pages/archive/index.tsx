import s from "./index.module.scss";
import cn from 'classnames'
import withGlobalProps from "/lib/withGlobalProps";
import { AllCollectionsDocument } from "/graphql";
import Link from "next/link";
import { Image } from "react-datocms/image";
import { useState, useRef, useEffect } from "react";
import { artworkCaption, sleep } from "/lib/utils";
import { NextNav } from "/components";

export type Props = {
  collections: CollectionRecord[]

}

const transition = async (image: HTMLImageElement, dImage: HTMLImageElement, dur: number = 700) => {

  const bounds = image.getBoundingClientRect();
  const dBounds = dImage.getBoundingClientRect();

  //clone image and position it over the original
  const clone = image.cloneNode(true) as HTMLImageElement;
  clone.style.position = 'absolute';
  clone.style.top = `${bounds.top}px`;
  clone.style.left = `${bounds.left}px`;
  clone.style.width = `${bounds.width}px`;
  clone.style.height = `${bounds.height}px`;
  clone.style.objectFit = 'contain';
  clone.style.objectPosition = 'center';
  clone.style.zIndex = 'var(--z-trans-image)';
  clone.style.pointerEvents = 'none';
  clone.style.transition = `all cubic-bezier(0.245, 0.765, 0.035, 0.920) ${dur}ms`;
  clone.style.opacity = '1';
  document.body.appendChild(clone);

  await sleep(100)

  image.style.opacity = '0';
  clone.style.top = `${dBounds.top}px`;
  clone.style.left = `${dBounds.left}px`;
  clone.style.width = `${dBounds.width}px`;
  clone.style.height = `${dBounds.height}px`;

  await sleep(dur)
  return clone
}


export default function Archive({ collections }: Props) {

  const [collectionId, setCollectionId] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const figureRef = useRef<HTMLDivElement>(null);
  const collection = collections.find(({ id }) => id === collectionId)

  const handleClick = () => {
    setIndex(index >= collection.artwork.length - 1 ? 0 : index + 1)
  }

  const handleZoomIn = async ({ target }) => {
    const id = target.closest('li').id;

    setTransitioning(true)
    setCollectionId(id)

    await sleep(100)
    const image = document.getElementById(id).querySelector<HTMLImageElement>('picture>img')
    const dImage = figureRef.current.querySelector<HTMLImageElement>('picture>img')
    const clone = await transition(image, dImage, 600)

    console.log('transitioning done')
    setTransitioning(false)
    clone.style.opacity = '0';
  }

  const handleZoomOut = async () => {
    if (!collectionId) return

    setTransitioning(true)

    const dImage = document.getElementById(collectionId).querySelector<HTMLImageElement>('picture>img')
    const image = figureRef.current.querySelector<HTMLImageElement>('picture>img')
    const clone = await transition(image, dImage, 600)

    dImage.style.opacity = '1';
    clone.style.opacity = '0';
    setTransitioning(false)
    setCollectionId(null)
  }

  return (
    <>
      <div className={cn(s.container, collection && s[collection.artwork[index].layout])}>
        <ul>
          {collections.map(({ id, title, description, year, artwork }) =>
            <li
              id={id}
              key={id}
              onClick={handleZoomIn}
              className={cn(id === collection?.id || collectionId === null ? s.active : s.inactive)}
            >
              <h2>{year}</h2>
              <Image
                data={artwork[0].image.responsiveImage}
                className={s.image}
                fadeInDuration={100}
                pictureClassName={s.picture}
              />
            </li>
          )}
        </ul>
      </div>

      <div className={cn(s.gallery, collection && s.visible)}>
        {collection &&
          <>
            <header>
              <span className={s.year}>2015</span>
              <span className={s.close} onClick={handleZoomOut}>Close</span>
            </header>
            <figure
              ref={figureRef}
              className={cn(transitioning ? s.invisible : s.visible)}
              onClick={handleClick}
            >
              <Image
                data={collection.artwork[index].image.responsiveImage}
                className={s.image}
                fadeInDuration={0}
                pictureClassName={cn(s.picture)}
              />
              <figcaption>{artworkCaption(collection.artwork[index])}</figcaption>
              <NextNav ref={figureRef} show={true} />
            </figure>

          </>
        }
      </div>
    </>
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