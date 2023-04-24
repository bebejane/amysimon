export default async (phase, { defaultConfig }) => {
	/**
	 * @type {import('next').NextConfig}
	 */
	const nextConfig = {
		typescript: {
			ignoreBuildErrors: true,
		},
		eslint: {
			ignoreDuringBuilds: true,
		},
		devIndicators: {
			buildActivity: false,
		},
		experimental: {
			scrollRestoration: true,
		},
		sassOptions: {
			includePaths: ["./components", "./pages"],
			prependData: `
				@use 'sass:math';
				@import './lib/styles/mediaqueries'; 
				@import './lib/styles/fonts';
			`,
		},
		webpack: (config, ctx) => {
			config.module.rules.push({
				test: /\.(graphql|gql)$/,
				exclude: /node_modules/,
				loader: "graphql-tag/loader",
			});
			config.module.rules.push({
				test: /\.svg$/i,
				issuer: /\.[jt]sx?$/,
				exclude: /node_modules/,
				use: ["@svgr/webpack"],
			});
			return config;
		},
	};
	return nextConfig;
};
