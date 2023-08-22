import { withRevalidate } from 'dato-nextjs-utils/hoc'

export default withRevalidate(async (record, revalidate) => {

  const paths = []
  const { api_key } = record.model;
  console.log('api_key', api_key)
  console.log('record', record)
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
      paths.push(`/archive`);
      break;
    case 'start':
      paths.push(`/`);
      break;
    default:
      break;
  }

  revalidate(paths)
})