import s from "./index.module.scss";
import cn from 'classnames'
import withGlobalProps from "/lib/withGlobalProps";
import { AllCollectionsDocument } from "/graphql";
import { Image } from "react-datocms/image";
import { useState, useRef, useEffect } from "react";
import { artworkCaption, sleep, transitionElement, transitionImage } from "/lib/utils";
import { NextNav } from "/components";
import useDevice from "/lib/hooks/useDevice";

export type Props = {
  collections: CollectionRecord[]
}

const transitionDuration = 700;

export default function Archive({ collections }: Props) {

  const [collectionId, setCollectionId] = useState<string | null>(null);
  const [collection, setCollection] = useState<CollectionRecord | null>(null);
  const [index, setIndex] = useState<{ [key: string]: number }>({});
  const [hoverCollectionId, setHoverCollectionId] = useState<string | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const { isMobile } = useDevice()
  const slidesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const idx = {}
    collections.forEach((collection) => (idx[collection.id] = 0))
    setIndex(idx)
  }, [])

  const handleClick = () => {
    const idx = index[collection.id] >= collection.artwork.length - 1 ? 0 : index[collection.id] + 1
    setIndex((s) => ({ ...s, [collection.id]: idx }))
  }

  const handleZoomIn = async ({ target }) => {

    const id = target.closest('li').id;

    setTransitioning(true)
    setCollectionId(id)
    setCollection(collections.find(el => el.id === id))

    if (isMobile) return

    await sleep(100)

    const image = document.getElementById(id).querySelector<HTMLImageElement>('picture>img')
    const dImage = slidesRef.current.querySelector<HTMLImageElement>(`figure:nth-of-type(${index[collection.id] + 1}) picture>img`)
    const caption = document.getElementById(id).querySelector<HTMLElement>('figcaption>span')
    const dCaption = document.getElementById('gallery-caption')
    const year = document.getElementById(id).querySelector<HTMLElement>('header')
    const dYear = document.getElementById('gallery-year')

    await Promise.all([
      transitionImage(image, dImage, transitionDuration),
      transitionElement(caption, dCaption, transitionDuration, -9),
      transitionElement(year, dYear, transitionDuration)
    ])

    setTransitioning(false)
  }

  const handleZoomOut = async () => {
    if (!collectionId) return

    setCollectionId(null)

    if (isMobile) return

    const dImage = document.getElementById(collectionId).querySelector<HTMLImageElement>('picture>img')
    const image = slidesRef.current.querySelector<HTMLImageElement>(`figure:nth-of-type(${index[collection.id] + 1}) picture>img`)
    setTransitioning(true)
    await transitionImage(image, dImage, transitionDuration)
    setTransitioning(false)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {

    if (transitioning || isMobile) return

    const target = (e.target as HTMLDivElement)
    const bounds = target.getBoundingClientRect();
    const p = (e.clientX - bounds.left) / bounds.width;
    const collection = collections.find(({ id }) => id === target.closest('figure').dataset.collectionId)
    const idx = Math.max(0, Math.floor(p * collection.artwork.length))

    setIndex((s) => ({ ...s, [collection.id]: idx }))
    setCollection(collection)
  }

  return (
    <>
      <div className={s.container}>
        <ul>
          {collections.map(({ id, title, description, year, artwork }) =>
            <li
              id={id}
              key={id}
              onClick={handleZoomIn}
              className={cn(id === collection?.id || collectionId === null ? s.active : s.inactive)}
            >
              <header>{year}</header>
              <figure
                className={s.wrapper}
                data-collection-id={id}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setHoverCollectionId(id)}
                onMouseLeave={() => setHoverCollectionId(null)}
              >
                <Image
                  data={artwork[index[id] ?? 0].image.responsiveImage}
                  className={s.image}
                  fadeInDuration={100}
                  pictureClassName={s.picture}
                />
                <figcaption className={cn(hoverCollectionId === id && s.show)}>
                  <span>{title}</span>
                </figcaption>
              </figure>
            </li>
          )}
        </ul>
      </div>

      <div className={cn(s.gallery, collectionId && s.visible)}>
        {collection &&
          <>
            <header className={s.desktop}>
              <span id="gallery-year" className={s.year}>{collection.year}</span>
              <span className={s.close} onClick={handleZoomOut}>Close</span>
            </header>
            <header className={s.mobile}>
              <span className={s.title}>{collection.title}, {collection.year}</span>
              <span className={s.back} onClick={handleZoomOut}>Back</span>
            </header>
            <div className={s.slides} ref={slidesRef}>
              {collection.artwork.map((artwork, i) =>
                <figure
                  key={artwork.id}
                  className={cn((i === index[collection.id] || isMobile) && s.show)}
                  onClick={handleClick}
                >
                  <Image
                    data={artwork.image.responsiveImage}
                    className={s.image}
                    fadeInDuration={0}
                    usePlaceholder={false}
                    lazyLoad={false}
                    pictureClassName={s.picture}
                  />
                  <figcaption>
                    <span id="gallery-caption">{collection.title}</span>
                    <span>{artworkCaption(artwork)}</span>
                  </figcaption>
                </figure>
              )}
            </div>
            <div className={s.pagination}>
              {index[collection.id] + 1}/{collection.artwork.length}
            </div>
            {collection.artwork.length > 1 &&
              <NextNav ref={slidesRef} show={true} />
            }
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

