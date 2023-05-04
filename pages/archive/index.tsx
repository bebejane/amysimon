import s from "./index.module.scss";
import cn from 'classnames'
import withGlobalProps from "/lib/withGlobalProps";
import { AllCollectionsDocument } from "/graphql";
import { Image } from "react-datocms";
import { useState, useRef, useEffect } from "react";
import { artworkCaption, sleep } from "/lib/utils";
import { GalleryNav } from "/components";
import { BsPlayCircle } from 'react-icons/bs'

import Youtube from 'react-youtube'
import useDevice from "/lib/hooks/useDevice";

export type ArtworkWithThumbnailRecord = ArtworkRecord & {
  thumbnail: ImageFileField
}

export type Props = {
  collections: (CollectionRecord & {
    artwork: ArtworkWithThumbnailRecord[]
  })[]
}

const transitionDuration = 700;

export default function Archive({ collections }: Props) {

  const [fullscreen, setFullscreen] = useState(false)
  const [collectionId, setCollectionId] = useState<string | null>(null);
  const [collection, setCollection] = useState<CollectionRecord | null>(null);
  const [index, setIndex] = useState<{ [key: string]: number }>({});
  const [hoverCollectionId, setHoverCollectionId] = useState<string | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [videoPlayId, setVideoPlayId] = useState<string | null>(null)
  const { isMobile } = useDevice()
  const slidesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const idx = {}
    collections.forEach((collection) => (idx[collection.id] = 0))
    setIndex(idx)
  }, [])

  const handleNext = () => {

    if (!collection) return

    const slideNumber = index[`${collection.id}-count`] ?? 0
    const atDescription = collection.description && slideNumber >= collection.artwork.length - 1
    const slideCount = collection.description ? collection.artwork.length + (atDescription ? 1 : 0) : collection.artwork.length
    const idx = index[collection.id] >= slideCount - 1 ? 0 : index[collection.id] + 1

    setIndex((s) => ({
      ...s,
      [collection.id]: idx,
      [`${collection.id}-count`]: s[`${collection.id}-count`] ? s[`${collection.id}-count`] + 1 : 1
    }))

    setFullscreen(collection.artwork[idx]?.layout === 'full-bleed')
  }

  const handlePrev = () => {

    if (!collection) return
    const slideCount = collection.description ? collection.artwork.length + 1 : collection.artwork.length
    const idx = index[collection.id] > 0 ? index[collection.id] - 1 : slideCount - 1
    setIndex((s) => ({ ...s, [collection.id]: idx }))
    setFullscreen(collection.artwork[idx]?.layout === 'full-bleed')
  }

  const handleZoomIn = async ({ target }) => {

    const id = target.closest('li').id;
    const collection = collections.find(el => el.id === id)

    setIndex((s) => ({ ...s, [`${collection.id}-count`]: 0 }))
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

      const isFullBleed = getComputedStyle(dImage).objectFit === 'cover'

      setFullscreen(isFullBleed)

      await Promise.all([
        transitionImage(image, dImage, transitionDuration, isFullBleed ? 'cover' : 'contain'),
        transitionElement(caption, dCaption, transitionDuration, -9, isFullBleed ? { color: 'var(--white)' } : {}),
        transitionElement(year, dYear, transitionDuration, 0, isFullBleed ? { color: 'var(--white)' } : {})
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
    const gallery = document.getElementById('gallery')

    setIndex((s) => ({ ...s, [collection.id]: idx }))
    setTransitioning(true)
    setCollectionId(null)

    if (!isMobile) {

      const dImage = document.getElementById(collectionId).querySelector<HTMLImageElement>('picture>img')
      const image = slidesRef.current.querySelector<HTMLImageElement>(`figure:nth-of-type(${idx + 1}) picture>img`)

      if (image && dImage)
        await transitionImage(image, dImage, transitionDuration / 1.5, getComputedStyle(image).objectFit)
      else
        await sleep(transitionDuration)
    }


    setCollection(null)
    setFullscreen(false)

    setTransitioning(false)
    gallery.classList.remove(s.transitioning)
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

  useEffect(() => {
    document.getElementById(`video-${videoPlayId}`)?.scrollIntoView({ behavior: 'smooth' })
  }, [videoPlayId])

  useEffect(() => { // keyboard navigation
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'Escape') handleZoomOut()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)

  }, [collectionId, collection, index])


  return (
    <>
      <div className={cn(s.container)}>
        <ul>
          {collections.map(({ id, title, year, artwork }, idx) => {
            const sameYear = collections[idx - 1]?.year === year
            return (
              <li
                id={id}
                key={id}
                onClick={handleZoomIn}
                className={cn(id === collection?.id || collectionId === null ? s.active : s.inactive)}
              >
                <header className="track">{!sameYear ? year ?? 'Also' : ''}</header>
                <figure
                  className={s.wrapper}
                  data-collection-id={id}
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => setHoverCollectionId(id)}
                  onMouseLeave={() => setHoverCollectionId(null)}
                  style={{ animationDelay: `${(idx * 250)}ms` }}
                >
                  {artwork[index[id]]?.thumbnail &&
                    <Image
                      data={artwork[index[id]].thumbnail.responsiveImage}
                      className={s.image}
                      fadeInDuration={0}
                      usePlaceholder={true}
                      lazyLoad={false}
                      placeholderClassName={s.placeholder}
                      pictureClassName={s.picture}
                    />
                  }

                  {//@ts-ignore
                    artwork.map(({ thumbnail }, idx) =>
                      <Image
                        data={thumbnail.responsiveImage}
                        className={cn(s.image, s.preload)}
                        fadeInDuration={0}
                        lazyLoad={false}
                        placeholderClassName={s.placeholder}
                        pictureClassName={s.picture}
                      />
                    )}

                  <figcaption className={cn(hoverCollectionId === id && s.show)}>
                    <span>{title}</span>
                  </figcaption>

                </figure>
              </li>
            )
          })}
        </ul>
      </div>
      {collection &&
        <>
          <div className={cn(s.galleryBackground, collectionId && s.visible)}></div>
          <div id="gallery" className={cn(s.gallery, collectionId && s.visible)}>

            <header className={cn(s.desktop, fullscreen && s.fullscreen)}>
              <span id="gallery-year" className={cn(s.year, "track")}>{collection.year ?? 'Also'}</span>
              <span className={s.close} onClick={handleZoomOut}>Close</span>
            </header>

            <header className={s.mobile}>
              <span className={s.title}>{collection.title}{collection.year && <>, {collection.year}</>}</span>
              <span className={s.back} onClick={handleZoomOut}>Back</span>
            </header>

            <div className={s.slides} ref={slidesRef}>
              {collection.artwork.map((artwork, i) =>
                <figure
                  key={artwork.id}
                  className={cn(((i === index[collection.id] && collectionId) || isMobile) && s.show, s[artwork.layout])}
                >
                  {artwork.image.responsiveImage &&
                    <Image
                      data={artwork.image.responsiveImage}
                      className={cn(s.image, videoPlayId === artwork.id && s.hide)}
                      fadeInDuration={0}
                      usePlaceholder={true}
                      lazyLoad={false}
                      placeholderClassName={s.picture}
                      pictureClassName={s.picture}
                    />
                  }
                  {artwork.video &&
                    <div className={s.video} >
                      {videoPlayId === artwork.id ?
                        <div className={s.wrapper} id={`video-${artwork.id}`}>
                          <div className={s.close} onClick={() => setVideoPlayId(null)}>Back</div>
                          <Youtube
                            opts={{ playerVars: { autoplay: true, controls: 0, rel: 0 } }}
                            videoId={artwork.video.providerUid}
                            className={cn(s.player, s.show)}
                          />
                        </div>
                        :
                        <BsPlayCircle className={s.play} onClick={() => setVideoPlayId(artwork.id)} />
                      }
                    </div>
                  }
                  <figcaption id={`caption-${i}`}>
                    <span>{collection.title}</span>
                    <span>{artwork.title && <em>{artwork.title}</em>}{artworkCaption(artwork, isMobile) && <>,&nbsp;</>}{artworkCaption(artwork, isMobile)}</span>
                  </figcaption>
                </figure>
              )}

              <figure className={cn(s.description, (index[collection.id] === collection.artwork.length || isMobile) && s.show)}>
                <span>{collection.description}</span>
              </figure>

            </div>
            {collection.artwork.length > 1 && collectionId && !transitioning &&
              <GalleryNav show={true} onNext={handleNext} onPrev={handlePrev} />
            }

          </div >
        </>
      }

    </>
  );
}

export const getStaticProps = withGlobalProps({ queries: [AllCollectionsDocument] }, async ({ props, revalidate }: any) => {

  return {
    props: {
      ...props,
      collections: props.collections.sort((a, b) => !a.year ? -1 : a.year > b.year ? -1 : 1),
      page: {
        title: 'Archive'
      }
    },
    revalidate
  };
});


export const transitionImage = async (image: HTMLImageElement, dImage: HTMLImageElement, dur: number = 600, objectFit = 'contain') => {

  const bounds = image.getBoundingClientRect();
  const dBounds = dImage.getBoundingClientRect();
  const easing = 'cubic-bezier(0.245, 0.765, 0.035, 0.920)'
  const { scrollY } = window;

  const clone = image.cloneNode(true) as HTMLImageElement;
  clone.style.position = 'absolute';
  clone.style.top = `${bounds.top + scrollY}px`;
  clone.style.left = `${bounds.left}px`;
  clone.style.width = `${bounds.width}px`;
  clone.style.height = `${bounds.height}px`;
  clone.style.objectFit = objectFit;
  clone.style.objectPosition = 'center';
  clone.style.zIndex = 'var(--z-trans-image)';
  clone.style.pointerEvents = 'none';
  clone.style.transition = ['top', 'left', 'width', 'height', 'opacity'].map(prop => `${prop} ${easing} ${dur}ms`).join(',');
  clone.style.opacity = '1';
  clone.style.visibility = 'visible';
  clone.style.willChange = 'top, left, width, height, opacity';

  document.body.appendChild(clone);

  await new Promise((resolve) => clone.onload = () => resolve(true))

  image.style.opacity = '0';
  dImage.style.opacity = '0';

  clone.style.top = `${scrollY + dBounds.top}px`;
  clone.style.left = `${dBounds.left}px`;
  clone.style.width = `${dBounds.width}px`;
  clone.style.height = `${dBounds.height}px`;

  await sleep(dur + 50)

  dImage.style.opacity = '1';
  clone.style.opacity = '0';
  setTimeout(() => clone.remove(), 200);
  return clone
}

export const transitionElement = async (el: HTMLElement, dEl: HTMLElement, dur: number = 600, topMargin: number = 0, style = {}) => {

  const bounds = el.getBoundingClientRect();
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
  Object.assign(clone.style, style)

  document.body.appendChild(clone);

  el.style.opacity = '0';
  dEl.style.opacity = '0';

  await sleep(100)

  clone.style.top = `${dBounds.top + scrollY + topMargin}px`;
  clone.style.left = `${dBounds.left}px`;

  await sleep(dur)

  el.style.opacity = '1';
  dEl.style.opacity = '1';
  clone.remove()

  return clone
}