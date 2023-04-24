import s from './Content.module.scss'
import cn from 'classnames'
import React from 'react'
import useStore from '/lib/store'
import { usePage } from '/lib/context/page'
import { useRouter } from 'next/router'

export type ContentProps = {
	children: React.ReactNode,
	title: string
}

export default function Content({ children, title }: ContentProps) {

	const { asPath } = useRouter()

	return (
		<>
			<main id="content" className={cn(s.content)}>

				<article>
					{children}
				</article>

			</main>
		</>
	)
}