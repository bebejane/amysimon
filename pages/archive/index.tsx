import s from "./index.module.scss";
import cn from 'classnames'
import withGlobalProps from "/lib/withGlobalProps";
import { AllCollectionsDocument } from "/graphql";
import { Image } from "react-datocms";
import { useState, useRef, useEffect } from "react";
import { artworkCaption, sleep } from "/lib/utils";
import { GalleryNav } from "/components";
import { BsPlayCircle } from 'react-icons/bs'
import { ImSpinner8 } from 'react-icons/im'

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

const transitionDuration = 500;

export default function Archive({ collections }: Props) {

  const [fullscreen, setFullscreen] = useState(false)
  const [showCollection, setShowCollection] = useState(false);
  const [collection, setCollection] = useState<CollectionRecord | null>(null);
  const [index, setIndex] = useState<{ [key: string]: number }>({});
  const [thumbLoaded, setThumbLoaded] = useState<{ [key: string]: boolean }>({});
  const [allThumbsLoaded, setAllThumbsLoaded] = useState(false);
  const [loaded, setLoaded] = useState<{ [key: string]: boolean }>({});
  const [mainImagesLoaded, setMainImagesLoaded] = useState(false);

  const [hoverCollectionId, setHoverCollectionId] = useState<string | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [videoPlayId, setVideoPlayId] = useState<string | null>(null)
  const { isMobile } = useDevice()
  const cloneRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<NodeJS.Timer | null>(null);
  const thumbsLoaderRef = useRef<NodeJS.Timer | null>(null);

  useEffect(() => {
    const idx = {}
    collections.forEach((collection) => (idx[collection.id] = 0))
    setIndex(idx)
  }, [])

  const handleNext = () => {

    if (!collection) return

    const slideNumber = index[`${collection.id}-count`] ?? 0
    const atDescription = collection.description && slideNumber === collection.artwork.length - 1
    const slideCount = collection.artwork.length + (collection.description && atDescription ? 1 : 0)
    const idx = atDescription ? collection.artwork.length : index[collection.id] >= slideCount - 1 ? 0 : index[collection.id] + 1

    setIndex((s) => ({
      ...s,
      [collection.id]: idx,
      [`${collection.id}-count`]: slideNumber + 1 > collection.artwork.length ? 0 : slideNumber + 1
    }))

    setFullscreen(collection.artwork[idx]?.layout === 'full-bleed')
  }

  const handlePrev = () => {

    if (!collection) return
    const slideNumber = index[`${collection.id}-count`] ?? 0
    const slideCount = collection.description ? collection.artwork.length + 1 : collection.artwork.length
    const idx = index[collection.id] > 0 ? index[collection.id] - 1 : slideCount - 1
    setIndex((s) => ({ ...s, [collection.id]: idx }))
    setFullscreen(collection.artwork[idx]?.layout === 'full-bleed')
  }

  const handleZoomIn = async ({ target }) => {

    if (transitioning) return console.log('transitioning')

    const id = target.closest('li').id;
    const collection = collections.find(el => el.id === id)
    const idx = { ...index, [`${collection.id}-count`]: 0 }

    setTransitioning(true)
    setIndex(idx)
    setCollection(collection)

    if (!isMobile) {
      try {
        const image = document.getElementById(id).querySelector<HTMLImageElement>(`picture>img`)
        const dImage = document.getElementById(`slides-${id}`).querySelector<HTMLImageElement>(`figure:nth-of-type(${idx[collection.id] + 1}) picture>img`)

        setShowCollection(true)

        const caption = document.getElementById(id).querySelector<HTMLElement>('figcaption>span')
        const dCaption = document.getElementById(`caption-${id}-${idx[id]}`).querySelector<HTMLElement>('span:nth-child(1)')
        const dCaptionText = document.getElementById(`caption-${id}-${idx[id]}`).querySelector<HTMLElement>('span:nth-child(2)')
        const year = document.getElementById(id).querySelector<HTMLElement>('header')
        const dYear = document.getElementById(`gallery-year-${id}`)

        dCaptionText.style.visibility = 'hidden'
        dCaptionText.style.opacity = '0'

        const isFullBleed = getComputedStyle(dImage).objectFit === 'cover'

        setFullscreen(isFullBleed)

        const [clone] = await Promise.all([
          transitionImage(image, dImage, transitionDuration, isFullBleed ? 'cover' : 'contain'),
          transitionElement(caption, dCaption, transitionDuration, -9, isFullBleed ? { color: 'var(--white)' } : {}),
          transitionElement(year, dYear, transitionDuration, 0, isFullBleed ? { color: 'var(--white)' } : {})
        ])

        setTimeout(() => {
          clone.remove()
          dCaptionText.style.visibility = 'visible'
          dCaptionText.style.opacity = '1'
        }, 200)

      } catch (e) {
        console.error(e)
      }
    } else
      setShowCollection(true)

    setTransitioning(false)
  }

  const handleZoomOut = async () => {
    if (!showCollection || transitioning) return console.log('no show collection')

    const idx = index[collection.id] >= collection.artwork.length ? 0 : index[collection.id]
    const isTextSlide = index[collection.id] >= collection.artwork.length
    const gallery = document.getElementById(`gallery-${collection.id}`)

    if (!isMobile && !isTextSlide) {

      try {

        const dImage = document.getElementById(collection.id).querySelector<HTMLImageElement>(`picture>img`)
        const image = document.getElementById(`slides-${collection.id}`).querySelector<HTMLImageElement>(`figure:nth-of-type(${idx + 1}) picture>img`)

        if (cloneRef.current)
          cloneRef.current.remove()

        setTransitioning(true)

        if (image && dImage && !isTextSlide) {
          const clone = await transitionImage(image, dImage, transitionDuration, getComputedStyle(image).objectFit, () => setShowCollection(false))
          clone.remove()
        }
        else
          await sleep(transitionDuration)

      } catch (err) {
        console.error(err)
      }
    }

    setShowCollection(false)
    setIndex((s) => ({ ...s, [collection.id]: idx }))
    setCollection(null)
    setFullscreen(false)
    setTransitioning(false)
    gallery.classList.remove(s.transitioning)

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

  }, [showCollection, collection, index, transitioning])

  useEffect(() => {
    if (hoverCollectionId)
      setCollection(collections.find(({ id }) => id === hoverCollectionId))
  }, [hoverCollectionId])

  useEffect(() => {
    const imageIds = collections.map(({ artwork }) => artwork[0].image.id)
    setMainImagesLoaded(imageIds.filter(id => loaded[id]).length === imageIds.length)

    if (Object.keys(loaded).length === 0 && !loaderRef.current)
      loaderRef.current = setTimeout(() => setMainImagesLoaded(true), 3000)

    if (Object.keys(thumbLoaded).length === 0 && !thumbsLoaderRef.current)
      thumbsLoaderRef.current = setTimeout(() => setAllThumbsLoaded(true), 2000)

  }, [collections, loaded, thumbLoaded])

  return (
    <>
      <div className={cn(s.container)}>
        <ul>
          {collections.map(({ id, title, year, yearEnd, artwork }, idx) => {
            const sameYear = collections[idx - 1]?.year === year
            return (
              <li
                id={id}
                key={id}
                onClick={handleZoomIn}
                className={cn((id === collection?.id || !showCollection) ? s.active : s.inactive)}
              >
                <header className="track">
                  {!sameYear ? year ? `${year}${yearEnd ? ` – ${yearEnd}` : ''}` : 'Also' : ''}
                </header>
                <figure
                  className={s.wrapper}
                  data-collection-id={id}
                  data-image-id={artwork[index[id]]?.id}
                  onMouseEnter={() => !isMobile && setHoverCollectionId(id)}
                  onMouseLeave={() => !isMobile && setHoverCollectionId(null)}
                >
                  {artwork[index[id]]?.thumbnail &&
                    <Image
                      data={artwork[index[id]].thumbnail.responsiveImage}
                      className={s.image}
                      fadeInDuration={0}
                      usePlaceholder={true}
                      placeholderClassName={s.placeholder}
                      pictureClassName={s.picture}
                      onLoad={() => setThumbLoaded((s) => ({ ...s, [artwork[index[id]]?.thumbnail.id]: true }))}
                    />
                  }
                  {!thumbLoaded[artwork[index[id]]?.thumbnail.id] &&
                    <div className={s.thumbloader}>
                      <ImSpinner8 />
                    </div>
                  }
                  <figcaption className={cn(id === hoverCollectionId && s.show)}>
                    <span>{title}</span>
                  </figcaption>
                </figure>
              </li>
            )
          })}
        </ul>
      </div >
      <div className={cn(s.galleryBackground, showCollection && s.visible)} />

      {collections.map((c, idx) =>
        <div id={`gallery-${c.id}`} key={c.id} className={cn(s.gallery, showCollection && collection?.id === c.id && s.visible)}>

          <header className={cn(s.desktop, fullscreen && s.fullscreen)}>
            <span id={`gallery-year-${c.id}`} className={cn(s.year, "track")}>{c?.year ? `${c.year}${c.yearEnd ? ` – ${c.yearEnd}` : ''}` : 'Also'}</span>
            <span className={s.close} onClick={handleZoomOut}>Close</span>
          </header>

          <header className={s.mobile}>
            <span className={s.title}>{c.title}{c.year && <>, {`${c.year}${c.yearEnd ? ` – ${c.yearEnd}` : ''}`} </>}</span>
            <span className={s.back} onClick={handleZoomOut}>Back</span>
          </header>

          <div id={`slides-${c.id}`} className={cn(s.slides, isMobile && collection?.id !== c.id && s.hide)}>
            {c.artwork.map((artwork, i) =>
              <figure
                key={artwork.id}
                className={cn(((i === index[c.id] && collection?.id === c.id && showCollection) || isMobile) && s.show, s[artwork.layout])}
              >
                {artwork.image?.responsiveImage &&
                  <Image
                    data={artwork.image.responsiveImage}
                    className={cn(s.image, (i === 0 || collection?.id === c.id) && s.load, videoPlayId === artwork.id && s.hide)}
                    fadeInDuration={0}
                    usePlaceholder={true}
                    //lazyLoad={true}
                    priority={true}
                    placeholderClassName={s.placeholder}
                    pictureClassName={s.picture}
                    onLoad={() => setLoaded((s) => ({ ...s, [artwork.image.id]: true }))}
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
                <figcaption id={`caption-${c.id}-${i}`}>
                  <span>{c.title}</span>
                  <span>{artwork.title && <em>{artwork.title}</em>}{artworkCaption(artwork, isMobile) && <>,&nbsp;</>}{artworkCaption(artwork, isMobile)}</span>
                </figcaption>
              </figure>
            )}

            <figure className={cn(s.description, (index[c.id] === c.artwork.length || isMobile) && s.show)}>
              <span>{c.description}</span>
            </figure>
          </div>

          {c.artwork.length > 1 && index[c.id] < c.artwork.length &&
            <div className={cn(s.indicators)}>
              {c?.artwork.map((el, i) =>
                <span key={i} className={cn(i === index[c.id] && s.active)}>•</span>
              )}
            </div>
          }

          {c.artwork.length > 1 && collection?.id === c.id && showCollection && !transitioning &&
            <GalleryNav show={true} onNext={handleNext} onPrev={handlePrev} />
          }
        </div>
      )
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


export const transitionImage = async (image: HTMLImageElement, dImage: HTMLImageElement, dur: number = 600, objectFit = 'contain', onReady?: () => void) => {

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

  await new Promise((resolve) => clone.complete ? resolve(true) : (clone.onload = () => resolve(true)))

  onReady?.();

  image.style.visibility = 'hidden';
  dImage.style.visibility = 'hidden';

  await sleep(50)

  clone.style.top = `${scrollY + dBounds.top}px`;
  clone.style.left = `${dBounds.left}px`;
  clone.style.width = `${dBounds.width}px`;
  clone.style.height = `${dBounds.height}px`;

  await sleep(dur + 50)

  image.style.visibility = 'visible';
  dImage.style.visibility = 'visible';

  //setTimeout(() => clone.remove(), 200);
  return clone
}

export const transitionElement = async (el: HTMLElement, dEl: HTMLElement, dur: number = 600, topMargin: number = 0, style = {}) => {

  const bounds = el.getBoundingClientRect();
  const dBounds = dEl.getBoundingClientRect();
  const easing = 'cubic-bezier(0.245, 0.765, 0.035, 0.920)'
  const clone = el.cloneNode(true) as HTMLElement;
  const { scrollY } = window;

  clone.style.position = 'absolute';
  clone.style.top = `${bounds.top + scrollY}px`;
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