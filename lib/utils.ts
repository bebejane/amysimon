export const isServer = typeof window === 'undefined';

export const breakpoints = {
	mobile: 320,
	tablet: 740,
	desktop: 980,
	wide: 1441,
	navBreak: 1100,
};

export const parseDatoError = (err: any) => {
	const apiError = err.response?.body?.data;
	if (!apiError) return err?.message ?? err;

	const error = {
		_error: apiError,
		message: apiError.map(({ attributes: { details } }) => {
			const { messages } = details;
			const m = !messages ? undefined : (!Array.isArray(messages) ? [messages] : messages).join('. ');
			const d = (!Array.isArray(details) ? [details] : details)?.map(
				({ field_label, field_type, code, extraneous_attributes }) =>
					extraneous_attributes
						? `Error fields: ${extraneous_attributes.join(', ')}`
						: `${field_label} (${field_type}): ${code}`
			);
			return `${m ?? ''} ${d ?? ''}`;
		}),
		codes: apiError.map(({ attributes: { code } }) => code),
	};
	return error;
};

export const isEmptyObject = (obj: any) => Object.keys(obj).filter((k) => obj[k] !== undefined).length === 0;

export const capitalize = (str: string, lower: boolean = false) => {
	return (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, (match) => match.toUpperCase());
};

export const sleep = (ms: number) => new Promise((resolve, refject) => setTimeout(resolve, ms));

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

export const awaitElement = async <T>(selector: string) => {
	const cleanSelector = function (selector) {
		(selector.match(/(#[0-9][^\s:,]*)/g) || []).forEach(function (n) {
			selector = selector.replace(n, '[id="' + n.replace('#', '') + '"]');
		});
		return selector;
	};

	for (let i = 0; i < 100; i++) {
		const el = document.querySelector(cleanSelector(selector)) as T;
		if (el) return el;
		await sleep(30);
	}

	throw new Error(`Element ${selector} not found`);
};
