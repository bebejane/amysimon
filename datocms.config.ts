import { DatoCmsConfig } from 'next-dato-utils/config';
import { MetadataRoute } from 'next';

export default {
	routes: {
		start: async () => ['/'],
		about: async () => ['/about'],
		project: async () => ['/about'],
		exhibition: async () => ['/about'],
		collection_about: async () => ['/about'],
		artwork: async () => ['/', '/archive'],
		collection: async () => ['/archive'],
		upload: async ({ id }) => ['/archive', '/'],
	},
	sitemap: async () => {
		return [
			{
				url: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
				lastModified: new Date(),
				changeFrequency: 'daily',
				priority: 1,
			},
		] as MetadataRoute.Sitemap;
	},
	manifest: async () => {
		return {
			name: 'Amy Simon',
			short_name: 'Amy Simon',
			description:
				'Artist. Born in New York City, NY, 1957 Lives and Works in Stockholm, Sweden, and New York City, US',
			start_url: '/',
			display: 'standalone',
			background_color: '#ffffff',
			theme_color: '#000000',
			icons: [
				{
					src: '/favicon.ico',
					sizes: 'any',
					type: 'image/x-icon',
				},
			],
		} satisfies MetadataRoute.Manifest;
	},
	robots: async () => {
		return {
			rules: {
				userAgent: '*',
				allow: '/',
			},
		};
	},
} satisfies DatoCmsConfig;
