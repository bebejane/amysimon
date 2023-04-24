import s from './Layout.module.scss'
import React, { useState } from 'react'
import { Content, Footer, Grid, Menu, MenuMobile } from '/components'
import { useStore } from '/lib/store'


export type LayoutProps = {
	children: React.ReactNode,
	footer: any
	title: string
}

export default function Layout({ children, footer, title }: LayoutProps) {


	return (
		<>
			<Content title={title}>
				{children}
			</Content>
			<Menu />
			<MenuMobile />
			<Footer footer={footer} />
			<Grid />
		</>
	)
}