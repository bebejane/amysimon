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
    const slideCount = collection.description ? collection.artwork.length + 1 : collection.artwork.length
    const idx = index[collection.id] >= slideCount - 1 ? 0 : index[collection.id] + 1
    setIndex((s) => ({ ...s, [collection.id]: idx }))
  }

  const handleZoomIn = async ({ target }) => {

    const id = target.closest('li').id;
    const collection = collections.find(el => el.id === id)

    setCollection(collection)
    setCollectionId(id)
    setTransitioning(true)

    if (!isMobile) {

      await sleep(100)

      const image = document.getElementById(id).querySelector<HTMLImageElement>('picture>img')
      const dImage = slidesRef.current.querySelector<HTMLImageElement>(`figure:nth-of-type(${index[collection.id] + 1}) picture>img`)
      const caption = document.getElementById(id).querySelector<HTMLElement>('figcaption>span')
      const dCaption = document.getElementById(`caption-${index[id]}`).querySelector<HTMLElement>('span:nth-child(1)')
      const dCaptionText = document.getElementById(`caption-${index[id]}`).querySelector<HTMLElement>('span:nth-child(2)')
      const year = document.getElementById(id).querySelector<HTMLElement>('header')
      const dYear = document.getElementById('gallery-year')

      dCaptionText.style.visibility = 'hidden'
      dCaptionText.style.opacity = '0'

      await Promise.all([
        transitionImage(image, dImage, transitionDuration),
        transitionElement(caption, dCaption, transitionDuration, -9),
        transitionElement(year, dYear, transitionDuration)
      ])

      setTimeout(() => {
        dCaptionText.style.visibility = 'visible'
        dCaptionText.style.opacity = '1'
      }, 200)

    }

    setTransitioning(false)
  }

  const handleZoomOut = async () => {
    if (!collectionId) return

    const idx = index[collection.id] >= collection.artwork.length ? 0 : index[collection.id]

    setIndex((s) => ({ ...s, [collection.id]: idx }))
    setTransitioning(true)
    setCollectionId(null)
    setCollection(null)

    if (!isMobile) {

      const dImage = document.getElementById(collectionId).querySelector<HTMLImageElement>('picture>img')
      const image = slidesRef.current.querySelector<HTMLImageElement>(`figure:nth-of-type(${idx + 1}) picture>img`)

      if (image && dImage)
        await transitionImage(image, dImage, transitionDuration)
      else
        await sleep(transitionDuration)

    }

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
                {artwork[index[id]]?.image &&
                  <Image
                    data={artwork[index[id]].image.responsiveImage}
                    className={s.image}
                    fadeInDuration={100}
                    pictureClassName={s.picture}
                  />
                }
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
                  className={cn(((i === index[collection.id] && collectionId) || isMobile) && s.show)}
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
                  <figcaption id={`caption-${i}`}>
                    <span>{collection.title}</span>
                    <span>{artworkCaption(artwork, isMobile)}</span>
                  </figcaption>
                </figure>
              )}
              <figure onClick={handleClick} className={cn(s.description, (index[collection.id] === collection.artwork.length || isMobile) && s.show)}>
                <span>{collection.description}</span>
              </figure>
            </div>
            <div className={s.pagination}>
              {Math.min(collection.artwork.length, index[collection.id] + 1)}/{collection.artwork.length}
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

