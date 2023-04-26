import s from "./index.module.scss";
import cn from 'classnames'
import withGlobalProps from "/lib/withGlobalProps";
import { AllCollectionsDocument } from "/graphql";
import { Image } from "react-datocms/image";
import { useState, useRef, useEffect } from "react";
import { artworkCaption, sleep } from "/lib/utils";
import { NextNav } from "/components";

export type Props = {
  collections: CollectionRecord[]
}

const transitionDuration = 600;

export default function Archive({ collections }: Props) {

  const [collectionId, setCollectionId] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [aIndex, setAIndex] = useState<{ [key: string]: number }>({});
  const [hoverCollectionId, setHoverCollectionId] = useState<string | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const figureRef = useRef<HTMLDivElement>(null);
  const collection = collections.find(({ id }) => id === collectionId)

  const handleClick = () => {
    const idx = index >= collection.artwork.length - 1 ? 0 : index + 1
    setIndex(idx)
    setAIndex((s) => ({ ...s, [collection.id]: idx }))
  }

  const handleZoomIn = async ({ target }) => {
    const id = target.closest('li').id;

    setTransitioning(true)
    setCollectionId(id)

    await sleep(100)

    const image = document.getElementById(id).querySelector<HTMLImageElement>('picture>img')
    const dImage = figureRef.current.querySelector<HTMLImageElement>('picture>img')
    const caption = document.getElementById(id).querySelector<HTMLElement>('figcaption>span')
    const dCaption = document.getElementById('gallery-caption')
    const year = document.getElementById(id).querySelector<HTMLElement>('header')
    const dYear = document.getElementById('gallery-year')

    const [clone, cClone] = await Promise.all([
      transitionImage(image, dImage, transitionDuration),
      transitionElement(caption, dCaption, transitionDuration, -9),
      transitionElement(year, dYear, transitionDuration)
    ])

    setTransitioning(false)
    setTimeout(() => {
      clone.style.opacity = '0'
    }, 100)

  }

  const handleZoomOut = async () => {
    if (!collectionId) return

    setTransitioning(true)
    setCollectionId(null)

    const dImage = document.getElementById(collectionId).querySelector<HTMLImageElement>('picture>img')
    const image = figureRef.current.querySelector<HTMLImageElement>('picture>img')
    const clone = await transitionImage(image, dImage, 600)

    dImage.style.opacity = '1';

    setTimeout(() => {
      clone.style.opacity = '0';
      clone.remove()
      setTransitioning(false)
      setIndex(0)
    }, 100)

  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {

    const target = (e.target as HTMLDivElement)
    const bounds = target.getBoundingClientRect();
    const p = (e.clientX - bounds.left) / bounds.width;
    const collection = collections.find(({ id }) => id === target.closest('figure').dataset.collectionId)
    const idx = Math.max(0, Math.floor(p * collection.artwork.length))
    setAIndex((s) => ({ ...s, [collection.id]: idx }))

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
              <header>{year}</header>
              <figure
                className={s.wrapper}
                data-collection-id={id}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setHoverCollectionId(id)}
                onMouseLeave={() => setHoverCollectionId(null)}
              >
                <Image
                  data={artwork[aIndex[id] ?? 0].image.responsiveImage}
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

      <div className={cn(s.gallery, collection && s.visible)}>
        {collection &&
          <>
            <header>
              <span id="gallery-year" className={s.year}>{collection.year}</span>
              <span className={s.close} onClick={handleZoomOut}>Close</span>
            </header>
            <figure
              ref={figureRef}
              className={cn(transitioning ? s.invisible : s.visible)}
              onClick={handleClick}
            >
              <Image
                data={collection.artwork[aIndex[collectionId] ?? 0].image.responsiveImage}
                className={s.image}
                fadeInDuration={0}
                pictureClassName={cn(s.picture)}
              />
              <figcaption>
                <span id="gallery-caption">{collection.title}</span>
                <span>{artworkCaption(collection.artwork[index])}</span>
              </figcaption>
              <NextNav ref={figureRef} show={true} />
            </figure>
          </>
        }
      </div>
    </>
  );
}



const transitionImage = async (image: HTMLImageElement, dImage: HTMLImageElement, dur: number = 700) => {

  const bounds = image.getBoundingClientRect();
  const dBounds = dImage.getBoundingClientRect();
  const easing = 'cubic-bezier(0.245, 0.765, 0.035, 0.920)'
  const clone = image.cloneNode(true) as HTMLImageElement;
  const { scrollY } = window;

  clone.style.position = 'absolute';
  clone.style.top = `${bounds.top + scrollY}px`;
  clone.style.left = `${bounds.left}px`;
  clone.style.width = `${bounds.width}px`;
  clone.style.height = `${bounds.height}px`;
  clone.style.objectFit = 'contain';
  clone.style.objectPosition = 'center';
  clone.style.zIndex = 'var(--z-trans-image)';
  clone.style.pointerEvents = 'none';
  clone.style.transition = ['top', 'left', 'width', 'height'].map(prop => `${prop} ${easing} ${dur}ms`).join(',');
  clone.style.opacity = '1';
  clone.style.willChange = 'top, left, width, height, opacity';
  document.body.appendChild(clone);
  await sleep(100)

  clone.style.top = `${scrollY + dBounds.top}px`;
  clone.style.left = `${dBounds.left}px`;
  clone.style.width = `${dBounds.width}px`;
  clone.style.height = `${dBounds.height}px`;
  image.style.opacity = '0';

  await sleep(dur)
  return clone
}

const transitionElement = async (el: HTMLElement, dEl: HTMLElement, dur: number = 700, topMargin: number = 0) => {

  const bounds = el.getBoundingClientRect();
  const cStyle = getComputedStyle(el);
  const dBounds = dEl.getBoundingClientRect();
  const easing = 'cubic-bezier(0.245, 0.765, 0.035, 0.920)'
  const clone = el.cloneNode(true) as HTMLElement;
  const { scrollY } = window;

  clone.style.position = 'absolute';
  clone.style.top = `${bounds.top + scrollY + topMargin}px`;
  clone.style.left = `${bounds.left}px`;
  clone.style.zIndex = 'var(--z-trans-image)';
  clone.style.transition = ['top', 'left', 'opacity'].map(prop => `${prop} ${easing} ${dur}ms`).join(',');
  clone.style.opacity = '1';
  clone.style.willChange = 'top, left, opacity';

  document.body.appendChild(clone);

  el.style.opacity = '0';
  dEl.style.opacity = '0';

  await sleep(100)

  clone.style.top = `${dBounds.top + scrollY + topMargin}px`;
  clone.style.left = `${dBounds.left}px`;
  await sleep(dur + 200)
  el.style.opacity = '1';
  dEl.style.opacity = '1';
  clone.remove()

  return clone
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

