import s from './SelectedWorks.module.scss'
import cn from 'classnames'
import { useEffect, useState, useRef } from 'react'
import { Image } from 'react-datocms'

type Props = {
  artwork: ArtworkRecord[]
}

export default function SelectedWorks({ artwork }: Props) {

  const [show, setShow] = useState(false)
  const [fade, setFade] = useState(false)
  const [index, setIndex] = useState(0)
  const [nextTopMargin, setNextTopMargin] = useState<number | undefined>()
  const timeoutRef = useRef<NodeJS.Timer | null>()
  const currentArtwork = artwork[index]

  const style = { transform: `translateX(-${index * 100}%)` }

  const handleMouseMove = ({ clientY }: React.MouseEvent) => {
    setNextTopMargin(clientY)
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setNextTopMargin(undefined), 1000)
  }

  const handleClick = () => {
    setFade(true)
    setTimeout(() => setIndex(index === artwork.length - 1 ? 0 : index + 1), 400)
    setTimeout(() => setFade(false), 700)
  }

  useEffect(() => {
    setTimeout(() => setShow(true), 2000)
  }, [])


  return (
    <div
      className={cn(s.container, s[currentArtwork.layout])}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setNextTopMargin(undefined)}
    >
      <h2 className={cn(show && s.hide)}>
        SELECTED<br />
        WORK<br />
        1997—2023
      </h2>
      <ul className={cn(s.artwork, show && s.show)} style={style}>
        {artwork.map(({ id, image, year, title, material, format, width, height, layout }, idx) =>
          <li onClick={handleClick}>
            <figure className={s[layout]}>
              <Image
                data={image.responsiveImage}
                className={s.image}
                pictureClassName={s.picture}
              />
              <figcaption>{[title, material, width && height ? `${width} × ${height}` : undefined, year].filter(el => el).join(', ')}</figcaption>
            </figure>
          </li>
        )}
      </ul>
      <div className={cn(s.fade, fade && s.show)}>
        <div className={s.left}></div>
        <div className={s.right}></div>
      </div>
      {nextTopMargin && show && <nav className={s.next} style={{ top: `${nextTopMargin}px` }}>Next</nav>}
    </div>
  )
}