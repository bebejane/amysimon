import s from './Layout.module.scss'
import React, { useState } from 'react'
import { Content, Grid, Menu } from '/components'
import { useRouter } from 'next/router'
export type LayoutProps = {
	children: React.ReactNode,
	title: string
}

export default function Layout({ children, title }: LayoutProps) {

	return (
		<>
			<Menu />
			<Content title={title}>
				{children}
			</Content>

			<Grid />
		</>
	)
}