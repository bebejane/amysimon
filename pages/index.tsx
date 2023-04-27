import s from './index.module.scss'
import withGlobalProps from '/lib/withGlobalProps'
import { StartDocument } from '/graphql'
import cn from 'classnames'
import { useEffect, useState, useRef } from 'react'
import { Image } from 'react-datocms'
import { artworkCaption } from '/lib/utils'
import { NextNav } from '/components'

type Props = {
	start: StartRecord
}

export default function Home({ start: { selectedArtwork } }: Props) {

	const [show, setShow] = useState(false)
	const [fade, setFade] = useState(false)
	const [index, setIndex] = useState(0)
	const containerRef = useRef<HTMLDivElement | null>()
	const currentArtwork = selectedArtwork[index]

	const handleClick = () => {
		setIndex(index === selectedArtwork.length - 1 ? 0 : index + 1)
	}

	useEffect(() => {
		setTimeout(() => setShow(true), 1500)
	}, [])

	const header = [['SELECTED'], ['WORK'], ['1997', '—', '2023']]

	return (
		<>
			<h2 className={cn(s.header, show && s.hide)}>
				{header.map((words, idx) =>
					<div key={idx}>
						{words.map((w, i) =>
							<span key={`w-${i}`} style={{
								transition: `
									color 0.1s ease-in-out ${Math.abs(-2 + (idx + 1 * i) / 4)}s, 
									opacity 12s cubic-bezier(.02,.9,.2,.98) 2.5s
								`
							}}>{w}</span>
						)}
					</div>
				)}
			</h2>

			<div ref={containerRef} className={cn(s.container, s[currentArtwork.layout])}>
				<ul className={cn(s.artwork, show && s.show)}>
					{selectedArtwork.map(({ id, image, title, material, width, height, layout, _allReferencingCollections: collections }, idx) =>
						<li onClick={handleClick} className={cn(index === idx && s.show)}>
							<figure className={s[layout]}>
								<Image
									data={image.responsiveImage}
									className={s.image}
									placeholderClassName={s.picture}
									pictureClassName={s.picture}
								/>
								<figcaption>
									<span className={s.title}>{collections[0]?.title}</span>
									<span>{artworkCaption(currentArtwork)}</span>
								</figcaption>
							</figure>
						</li>
					)}
				</ul>

				<div className={s.pagination}>
					{index + 1}/{selectedArtwork.length}
				</div>
			</div>
			<NextNav show={show} ref={containerRef} className={s.next} />
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