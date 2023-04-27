import type { NextApiRequest, NextApiResponse } from 'next'

const generatePreviewUrl = async ({ item }) => {

  let path = null;
  const { api_key } = item.attributes

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
    case 'artwork':
      path = `/archive`;
      break;
    case 'start':
      path = `/`;
      break;
    default:
      break;
  }
  console.log(api_key, path)
  console.log(item)
  return path
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(200).send('ok');

  const path = await generatePreviewUrl(req.body);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL

  const previewLinks = !path ? [] : [{
    label: 'Live',
    url: `${baseUrl}${path}`
  }, {
    label: 'Utkast',
    url: `${baseUrl}/api/preview?slug=${path}&secret=${process.env.DATOCMS_PREVIEW_SECRET}`,
  }]

  return res.status(200).json({ previewLinks });
};
