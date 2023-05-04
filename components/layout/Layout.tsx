import s from './Layout.module.scss'
import React, { useState } from 'react'
import { Content, Grid, Menu } from '/components'

export type LayoutProps = {
	children: React.ReactNode,
	title: string
}

export default function Layout({ children, title }: LayoutProps) {

	return (
		<>

			<Content title={title}>
				{children}
			</Content>
			<Menu />
			<Grid />
		</>
	)
}