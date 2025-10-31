import s from './page.module.scss';
import { StartDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import { notFound } from 'next/navigation';
import Home from '@/components/Home';

export type PageProps = {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: PageProps) {
	const { start, draftUrl } = await apiQuery(StartDocument);

	if (!start) return notFound();

	return (
		<>
			<Home start={start} />
			<DraftMode url={draftUrl} path={`/`} />
		</>
	);
}
