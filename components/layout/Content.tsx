import s from './Content.module.scss'
import cn from 'classnames'
import React from 'react'
import { useRouter } from 'next/router'

export type ContentProps = {
	children: React.ReactNode,
	title: string
}

export default function Content({ children }: ContentProps) {
	const { asPath } = useRouter()
	const isHome = asPath === '/'

	return (
		<main id="content" className={cn(s.content, isHome && s.home)} key={asPath}>
			<article>
				{children}
			</article>
		</main>
	)
}