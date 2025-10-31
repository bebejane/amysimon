import { withWebPreviewsEdge } from 'dato-nextjs-utils/hoc';

export const config = {
  runtime: 'edge'
}

export default withWebPreviewsEdge(async ({ item, itemType }) => {

  let path = null;
  const { api_key } = itemType.attributes

  switch (api_key) {
    case 'about':
      path = `/about`;
      break;
    case 'project':
      path = `/about`;
      break;
    case 'exhibition':
      path = `/about`;
      break;
    case 'collection_about':
      path = `/about`;
      break;
    case 'artwork':
      path = `/archive`;
      break;
    case 'collection':
      path = `/archive`;
      break;
    case 'start':
      path = `/`;
      break;
    default:
      break;
  }

  return path
})