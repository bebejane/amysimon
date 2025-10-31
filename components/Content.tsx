'use client';

import s from './Content.module.scss';
import cn from 'classnames';
import React from 'react';
import useStore, { useShallow } from '@/lib/store';
import { useRouter } from 'next/router';

export type ContentProps = {
	children: React.ReactNode;
};

export default function Content({ children }: ContentProps) {
	const { asPath } = useRouter();
	const [isHome] = useStore(useShallow((s) => [s.isHome]));

	return (
		<main id='content' className={cn(s.content, isHome && s.home)} key={asPath}>
			<article>{children}</article>
		</main>
	);
}
