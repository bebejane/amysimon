import s from './index.module.scss'
import withGlobalProps from '/lib/withGlobalProps'
import { StartDocument } from '/graphql'
import cn from 'classnames'
import { useEffect, useState, useRef } from 'react'
import { Image } from 'react-datocms'
import { artworkCaption } from '/lib/utils'

type Props = {
	start: StartRecord
}

export default function Home({ start: { selectedArtwork } }: Props) {

	const [show, setShow] = useState(false)
	const [fade, setFade] = useState(false)
	const [index, setIndex] = useState(0)
	const [nextTopMargin, setNextTopMargin] = useState<number | undefined>()
	const timeoutRef = useRef<NodeJS.Timer | null>()
	const currentArtwork = selectedArtwork[index]

	const style = { transform: `translateX(-${index * 100}%)` }

	const handleMouseMove = ({ clientY }: React.MouseEvent) => {
		setNextTopMargin(clientY)
		clearTimeout(timeoutRef.current)
		timeoutRef.current = setTimeout(() => setNextTopMargin(undefined), 1000)
	}

	const handleClick = () => {
		setFade(true)
		setTimeout(() => {
			setIndex(index === selectedArtwork.length - 1 ? 0 : index + 1)
			setFade(false)
		}, 200)

	}

	useEffect(() => {
		setTimeout(() => setShow(true), 1500)
	}, [])

	return (
		<>
			<h2 className={cn(s.header, show && s.hide)}>
				SELECTED<br />
				WORK<br />
				1997—2023
			</h2>
			<div
				className={cn(s.container, s[currentArtwork.layout])}
				onMouseMove={handleMouseMove}
			>
				<ul className={cn(s.artwork, show && s.show)} style={style}>
					{selectedArtwork.map(({ id, image, year, title, material, format, width, height, layout }, idx) =>
						<li onClick={handleClick} >
							<figure className={s[layout]}>
								<Image
									data={image.responsiveImage}
									className={s.image}
									placeholderClassName={s.picture}
									pictureClassName={s.picture}
								/>
								<figcaption>
									{artworkCaption(currentArtwork)}
								</figcaption>
							</figure>
						</li>
					)}
				</ul>

				<div className={cn(s.fade, fade && s.show)}>
					<div className={s.left}></div>
					<div className={s.right}></div>
				</div>
				<nav className={cn(s.next, (!nextTopMargin || !show) && s.hide)} style={{ top: `${nextTopMargin}px` }}>Next</nav>
			</div >
		</>
	)
}

export const getStaticProps = withGlobalProps({ queries: [StartDocument] }, async ({ props, revalidate, context }: any) => {

	return {
		props: {
			...props,
			page: {
				title: 'Hem',
				layout: 'home',
			} as PageProps
		},
		revalidate
	}
})