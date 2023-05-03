import s from './index.module.scss'
import withGlobalProps from '/lib/withGlobalProps'
import { StartDocument } from '/graphql'
import cn from 'classnames'
import { useEffect, useState, useRef } from 'react'
import { Image } from 'react-datocms'
import useStore from '/lib/store'

type Props = {
	start: StartRecord
	firstCollection: CollectionRecord
	lastCollection: CollectionRecord
}

export default function Home({ start: { loadingImage, backgroundImage }, firstCollection, lastCollection }: Props) {

	const [setShowIntroLoading, setShowIntro] = useStore((s) => [s.setShowIntroLoading, s.setShowIntro])
	const containerRef = useRef<HTMLDivElement | null>()

	useEffect(() => {
		setTimeout(() => setShowIntroLoading(false), 3000)
	}, [])

	return (
		<>
			<div ref={containerRef} className={cn(s.container)}>
				<Image data={loadingImage.responsiveImage} fadeInDuration={0} className={cn(s.loading)} pictureClassName={s.picture} />
				<Image data={backgroundImage.responsiveImage} fadeInDuration={0} className={s.background} pictureClassName={s.picture} />
			</div>
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