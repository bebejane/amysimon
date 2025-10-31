'use client';

import s from './Content.module.scss';
import cn from 'classnames';
import React from 'react';
import useStore, { useShallow } from '@/lib/store';
import { usePathname } from 'next/navigation';

export type ContentProps = {
	children: React.ReactNode;
};

export default function Content({ children }: ContentProps) {
	const pathname = usePathname();
	const [isHome] = useStore(useShallow((s) => [s.isHome]));

	return (
		<main id='content' className={cn(s.content, isHome && s.home)} key={pathname}>
			<article>{children}</article>
		</main>
	);
}
