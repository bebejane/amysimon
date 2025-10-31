export const isServer = typeof window === 'undefined';

export const breakpoints = {
	mobile: 320,
	tablet: 740,
	desktop: 980,
	wide: 1441,
	navBreak: 1100,
};

export const randomInt = (min, max) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const artworkCaption = (artwork: ArtworkRecord, withYear: boolean) => {
	const { material, width, height, location, _allReferencingCollections } = artwork;
	const year = withYear
		? `${_allReferencingCollections[0]?.year}${_allReferencingCollections[0].yearEnd ? ` – ${_allReferencingCollections[0].yearEnd}` : ''}`
		: undefined;
	return [material, location, height && width ? `${height} × ${width} cm${artwork.multiple ? ' each' : ''}` : undefined]
		.filter((el) => el)
		.join(', ');
};
