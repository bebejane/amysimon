import s from "./index.module.scss";
import withGlobalProps from "/lib/withGlobalProps";
import { StartDocument } from "/graphql";
import { usePage } from "/lib/context/page";
import React from "react";

export type Props = {
	start: StartRecord
	artwork: ArtworkRecord[]
}

export default function Home({ start, artwork }: Props) {

	return (
		<div className={s.container}>
			start
		</div>
	);
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