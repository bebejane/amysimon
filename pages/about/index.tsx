import s from "./index.module.scss";
import withGlobalProps from "/lib/withGlobalProps";
import { AboutDocument } from "/graphql";
import Link from "next/link";

export type Props = {
  about: AboutRecord
  exhibitions: ExhibitionRecord[]
  projects: ProjectRecord[]
}

export default function About({ about, exhibitions, projects }: Props) {

  return (
    <div className={s.container}>
      <ul>
        <li>
          <h2>Amy Simon</h2>
          <p>
            {about.bio}
          </p>
        </li>
        <li>
          <h2>Selected Solo Exhibitions</h2>
          <ul>
            {exhibitions.map(({ id, title, year, location, city, country }) =>
              <li>
                {year} {[title, location, city, country].filter(el => el).join(', ')}
              </li>
            )}
          </ul>
        </li>
        <li>
          <h2>Awards / Projects</h2>
          <ul>
            {projects.map(({ id, from, until, description }) =>
              <li>
                {from}{until ? ` - ${until}` : ''} {description}
              </li>
            )}
          </ul>
        </li>
      </ul>
    </div>
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