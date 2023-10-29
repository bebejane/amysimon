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
    case 'collection_about':
      paths.push(`/about`);
      break;
    case 'artwork':
      paths.push(`/`);
      paths.push(`/archive`);
      break;
    case 'collection':
      paths.push(`/archive`);
      break;
    case 'start':
      paths.push(`/`);
      break;
    default:
      break;
  }

  await revalidate(paths)
})