import s from './index.module.scss'
import withGlobalProps from '/lib/withGlobalProps'
import { StartDocument } from '/graphql'
import cn from 'classnames'
import { useEffect, useState, useRef } from 'react'
import { Image } from 'react-datocms'
import { artworkCaption } from '/lib/utils'
import { GalleryNav } from '/components'

type Props = {
	start: StartRecord
	firstCollection: CollectionRecord
	lastCollection: CollectionRecord
}

export default function Home({ start: { selectedArtwork }, firstCollection, lastCollection }: Props) {

	const [show, setShow] = useState(false)
	const [fade, setFade] = useState(false)
	const [index, setIndex] = useState(0)
	const containerRef = useRef<HTMLDivElement | null>()
	const currentArtwork = selectedArtwork[index]
	const startYear = firstCollection.year
	const endYear = lastCollection.year

	const handlePrev = () => setIndex(index === 0 ? selectedArtwork.length - 1 : index - 1)
	const handleNext = () => setIndex(index >= selectedArtwork.length - 1 ? 0 : index + 1)

	useEffect(() => {
		setTimeout(() => setShow(true), 2000)
	}, [])

	return (
		<>
			<h2 className={s.header}>
				SELECTED<br />
				WORK<br />
				{startYear}—{endYear}
			</h2>

			<div ref={containerRef} className={cn(s.container, s[currentArtwork.layout])}>
				<ul className={cn(s.artwork, show && s.show)}>
					{selectedArtwork.map(({ id, image, title, material, width, height, layout, _allReferencingCollections: collections }, idx) =>
						<li className={cn(index === idx && s.show)} key={idx}>
							<figure className={s[layout]}>
								<Image
									data={image.responsiveImage}
									className={s.image}
									placeholderClassName={s.picture}
									pictureClassName={s.picture}
								/>
								<figcaption>
									<span className={s.title}>{collections[0]?.title}</span>
									<span>{artworkCaption(currentArtwork, true)}</span>
								</figcaption>
							</figure>
						</li>
					)}
				</ul>

				<div className={s.pagination}>
					{index + 1}/{selectedArtwork.length}
				</div>
			</div>
			<GalleryNav show={show} className={s.next} onNext={handleNext} onPrev={handlePrev} />
		</>
	)
}

export const getStaticProps = withGlobalProps({ queries: [StartDocument] }, async ({ props, revalidate, context }: any) => {

	return {
		props: {
			...props,
			firstCollection: props.firstCollection[0],
			lastCollection: props.lastCollection[0],
			page: {
				title: 'Hem',
				layout: 'home',
			} as PageProps
		},
		revalidate
	}
})