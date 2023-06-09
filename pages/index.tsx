import s from './index.module.scss'
import cn from 'classnames'
import withGlobalProps from '/lib/withGlobalProps'
import { StartDocument } from '/graphql'
import { useEffect, useState } from 'react'
import { Image } from 'react-datocms'
import useStore from '/lib/store'

type Props = {
	start: StartRecord
}

export default function Home({ start: { loadingImage, backgroundImage } }: Props) {

	const [setShowIntroLoading, setShowIntro] = useStore((s) => [s.setShowIntroLoading, s.setShowIntro])
	const [loaded, setLoaded] = useState(false)
	const [hide, setHide] = useState(false)

	useEffect(() => {

		if (loaded) {
			setHide(true)
			setTimeout(() => setShowIntroLoading(false), 3500)
		} else
			setShowIntro(true)

	}, [loaded])

	return (
		<>
			<Image
				data={loadingImage.responsiveImage}
				className={cn(s.loading, hide && s.hide)}
				placeholderClassName={s.placeholder}
				pictureClassName={s.picture}
				fadeInDuration={0}
				onLoad={() => setLoaded(true)}
			/>
			<Image
				data={backgroundImage.responsiveImage}
				fadeInDuration={0}
				className={s.background}
				pictureClassName={s.picture}
			/>
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