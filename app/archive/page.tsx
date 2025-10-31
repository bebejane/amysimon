import s from './page.module.scss';
import { AllCollectionsDocument } from '@/graphql';
import ArchiveGallery from './ArchiveGallery';
import { apiQuery } from 'next-dato-utils/api';

export default async function ArchivePage() {
	const { allCollections } = await apiQuery(AllCollectionsDocument);

	return <ArchiveGallery collections={allCollections} />;
}
