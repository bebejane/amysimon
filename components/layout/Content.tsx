import s from './Content.module.scss'
import React from 'react'
import { useRouter } from 'next/router'

export type ContentProps = {
	children: React.ReactNode,
	title: string
}

export default function Content({ children }: ContentProps) {
	const { asPath } = useRouter()

	return (
		<main id="content" className={s.content} key={asPath}>
			<article>
				{children}
			</article>
		</main>
	)
}