import s from "./index.module.scss";
import withGlobalProps from "/lib/withGlobalProps";
import { AboutDocument } from "/graphql";
import { DatoMarkdown as Markdown } from "dato-nextjs-utils/components";

export type Props = {
  about: AboutRecord
  exhibitions: ExhibitionRecord[]
  projects: ProjectRecord[]
  collections: CollectionAboutRecord[]
}

export default function About({ about, exhibitions, projects, collections }: Props) {

  let animationDelay = 0;

  return (
    <div className={s.container}>
      <ul>
        <li className={s.about}>
          <h2 className={s.bio}></h2>
          <div>
            <Markdown>{about.bio}
            </Markdown>
            Contact: <a href={`mailto:${about.email}`}>{about.email}</a>
          </div>
        </li>
        <li>
          <h2>Selected Solo Exhibitions</h2>
          <ul>
            {exhibitions.map(({ title, year, location, city, country }, idx) =>
              <li key={idx} style={{ animationDelay: `${(animationDelay += 100)}ms` }}>
                <span>{year}</span>
                <span><em>{title}</em>, {[location, city, country].filter(el => el).join(', ')}</span>
              </li>
            )}
          </ul>
        </li>
        <li>
          <h2>Collections</h2>
          <ul>
            {collections.map(({ description }, idx) =>
              <li key={idx}>
                <span className={s.long}></span>
                <span>{description}</span>
              </li>
            )}
          </ul>
        </li>
        <li>
          <h2>Awards / Projects</h2>
          <ul>
            {projects.map(({ from, until, description }, idx) =>
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