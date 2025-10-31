import s from './page.module.scss';
import { AboutDocument } from '@/graphql';
import { Markdown } from 'next-dato-utils/components';
import { apiQuery } from 'next-dato-utils/api';

export default async function AboutPage() {
	const { about, allCollectionAbouts, allExhibitions, allProjects } = await apiQuery(AboutDocument);

	let animationDelay = 0;

	return (
		<div className={s.container}>
			<ul>
				<li className={s.about}>
					<h2 className={s.bio}></h2>
					<div>
						<Markdown content={about.bio} />
						Contact: <a href={`mailto:${about.email}`}>{about.email}</a>
					</div>
				</li>
				<li>
					<h2>Selected Solo Exhibitions</h2>
					<ul>
						{allExhibitions.map(({ title, year, location, city, country }, idx) => (
							<li key={idx} style={{ animationDelay: `${(animationDelay += 100)}ms` }}>
								<span>{year}</span>
								<span>
									<em>{title}</em>, {[location, city, country].filter((el) => el).join(', ')}
								</span>
							</li>
						))}
					</ul>
				</li>
				<li>
					<h2>Collections</h2>
					<ul>
						{allCollectionAbouts.map(({ description }, idx) => (
							<li key={idx}>
								<span className={s.long}></span>
								<span>{description}</span>
							</li>
						))}
					</ul>
				</li>
				<li>
					<h2>Awards / Projects</h2>
					<ul>
						{allProjects.map(({ from, until, description }, idx) => (
							<li key={idx}>
								<span className={s.long}>
									{from}
									{until ? `-${(until + '').substring(2)}` : ''}
								</span>
								<span>{description}</span>
							</li>
						))}
					</ul>
				</li>
			</ul>
		</div>
	);
}
