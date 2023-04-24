import { withRevalidate } from 'dato-nextjs-utils/hoc'

export default withRevalidate(async (record, revalidate) => {

  const paths = []
  const { api_key } = record.model;

  switch (api_key) {
    case 'about':
      paths.push(`/about`);
      break;
    case 'project':
      paths.push(`/about`);
      break;
    case 'exhibition':
      paths.push(`/about`);
      break;
    case 'artwork':
      paths.push(`/`);
      break;
    case 'start':
      paths.push(`/`);
      break;
    default:
      break;
  }

  revalidate(paths)
})