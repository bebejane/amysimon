import s from './index.module.scss'
import withGlobalProps from '/lib/withGlobalProps'
import { StartDocument } from '/graphql'
import cn from 'classnames'
import { useEffect, useRef, useState } from 'react'
import { Image } from 'react-datocms'
import useStore from '/lib/store'

type Props = {
	start: StartRecord
}

export default function Home({ start: { loadingImage, backgroundImage } }: Props) {

	const [setShowIntroLoading, setShowIntro] = useStore((s) => [s.setShowIntroLoading, s.setShowIntro])
	const [loaded, setLoaded] = useState(false)
	const containerRef = useRef<HTMLDivElement | null>()

	useEffect(() => {
		if (loaded)
			setTimeout(() => setShowIntroLoading(false), 3500)
		else
			setShowIntro(true)
	}, [loaded])

	return (
		<>
			<div ref={containerRef} className={cn(s.container)}>
				<Image data={loadingImage.responsiveImage} fadeInDuration={0} className={s.loading} pictureClassName={s.picture} onLoad={() => setLoaded(true)} />
				<Image data={backgroundImage.responsiveImage} fadeInDuration={0} className={s.background} pictureClassName={s.picture} />
			</div>
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