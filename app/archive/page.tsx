import { AllCollectionsDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import ArchiveGallery from '@/components/ArchiveGallery';

export default async function ArchivePage() {
	const { allCollections } = await apiQuery(AllCollectionsDocument);

	return <ArchiveGallery collections={allCollections} />;
}
