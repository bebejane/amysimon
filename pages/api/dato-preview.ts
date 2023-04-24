import type { NextApiRequest, NextApiResponse } from 'next'
import { apiQuery } from 'dato-nextjs-utils/api';

const generatePreviewUrl = async ({ item, itemType, locale }) => {

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

  return path
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(200).send('ok');

  const url = await generatePreviewUrl(req.body);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL
  const previewLinks = !url ? [] : [{
    label: 'Live',
    url: `${baseUrl}${url}`
  }, {
    label: 'Utkast',
    url: `${baseUrl}/api/preview?slug=${url}&secret=${process.env.DATOCMS_PREVIEW_SECRET}`,
  }]

  console.log(previewLinks)
  return res.status(200).json({ previewLinks });
};
