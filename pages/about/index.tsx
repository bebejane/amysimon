import s from "./index.module.scss";
import withGlobalProps from "/lib/withGlobalProps";
import { AboutDocument } from "/graphql";
import { DatoMarkdown as Markdown } from "dato-nextjs-utils/components";
import Link from "next/link";

export type Props = {
  about: AboutRecord
  exhibitions: ExhibitionRecord[]
  projects: ProjectRecord[]
}

export default function About({ about, exhibitions, projects }: Props) {

  let animationDelay = 0;

  return (
    <div className={s.container}>
      <ul>
        <li>
          <h2 className={s.bio}>Amy Simon</h2>
          <Markdown>{about.bio}</Markdown>
        </li>
        <li>
          <h2>Exhibitions</h2>
          <ul>
            {exhibitions.map(({ id, title, year, location, city, country }, idx) =>
              <li key={idx} style={{ animationDelay: `${(animationDelay += 100)}ms` }}>
                <span>{year}</span>
                <span>{[title, location, city, country].filter(el => el).join(', ')}</span>
              </li>
            )}
          </ul>
        </li>
        <li>
          <h2>Awards / Projects</h2>
          <ul>
            {projects.map(({ id, from, until, description }, idx) =>
              <li key={idx}>
                <span className={s.long}>{from}{until ? `-${(until + '').substring(2)}` : ''}</span>
                <span>{description}</span>
              </li>
            )}
          </ul>
        </li>
      </ul >
    </div >
  );
}

export const getStaticProps = withGlobalProps({ queries: [AboutDocument] }, async ({ props, revalidate }: any) => {

  return {
    props: {
      ...props,
      page: {
        title: 'About'
      }
    },
    revalidate
  };
});