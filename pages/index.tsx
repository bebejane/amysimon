import s from "./index.module.scss";
import withGlobalProps from "/lib/withGlobalProps";
import { StartDocument } from "/graphql";
import { SelectedWorks } from "/components";
import { usePage } from "/lib/context/page";
import React from "react";

export type Props = {
	start: StartRecord
}

export default function Home({ start }: Props) {

	return (
		<SelectedWorks artwork={start.selectedArtwork} />
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