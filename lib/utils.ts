import { TypedDocumentNode } from "@apollo/client/core";
import { apiQuery } from "dato-nextjs-utils/api";
import type { ApiQueryOptions } from "dato-nextjs-utils/api";

export const isServer = typeof window === 'undefined';

export const breakpoints = {
  mobile: 320,
  tablet: 740,
  desktop: 980,
  wide: 1441,
  navBreak: 1100
}

export const parseDatoError = (err: any) => {
  const apiError = err.response?.body?.data;
  if (!apiError) return err?.message ?? err

  const error = {
    _error: apiError,
    message: apiError.map(({ attributes: { details } }) => {
      const { messages } = details
      const m = !messages ? undefined : (!Array.isArray(messages) ? [messages] : messages).join('. ')
      const d = (!Array.isArray(details) ? [details] : details)?.map(({ field_label, field_type, code, extraneous_attributes }) =>
        extraneous_attributes ? `Error fields: ${extraneous_attributes.join(', ')}` : `${field_label} (${field_type}): ${code}`
      )
      return `${m ?? ''} ${d ?? ''}`
    }),
    codes: apiError.map(({ attributes: { code } }) => code),
  }
  return error
}

export const isEmptyObject = (obj: any) => Object.keys(obj).filter(k => obj[k] !== undefined).length === 0

export const capitalize = (str: string, lower: boolean = false) => {
  return (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());
}

export const sleep = (ms: number) => new Promise((resolve, refject) => setTimeout(resolve, ms))

export const apiQueryAll = async (doc: TypedDocumentNode, opt: ApiQueryOptions = {}): Promise<any> => {

  const results = {}
  let size = 100;
  let skip = 0;
  const res = await apiQuery(doc, { variables: { ...opt.variables, first: size, skip } });

  if (res.pagination?.count === undefined)
    throw new Error('Not a pagable query')

  const { count } = res.pagination

  const mergeProps = (res) => {
    const props = Object.keys(res);

    for (let i = 0; i < props.length; i++) {
      const k = props[i]
      const el = res[props[i]];
      if (Array.isArray(el)) {
        results[k] = !results[k] ? el : results[k].concat(el)
      } else
        results[k] = el;
    }
  }

  const isRejected = (input: PromiseSettledResult<unknown>): input is PromiseRejectedResult =>
    input.status === 'rejected'

  const isFulfilled = <T>(input: PromiseSettledResult<T>): input is PromiseFulfilledResult<T> =>
    input.status === 'fulfilled'

  mergeProps(res)

  let reqs = []
  for (let skip = size; skip < count; skip += size) {
    if (reqs.length < 50 && skip + size < count) {
      reqs.push(apiQuery(doc, { variables: { ...opt.variables, first: size, skip } }))
    } else {

      reqs.push(apiQuery(doc, { variables: { ...opt.variables, first: size, skip } }))
      const data = await Promise.allSettled(reqs)
      const error = data.find(isRejected)?.reason
      if (error)
        throw new Error(error)

      for (let x = 0; x < data.length; x++) {
        //@ts-ignore
        mergeProps(data[x].value);
      }
      await sleep(100)
      reqs = []
    }
  }
  return results
}

export const randomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const artworkCaption = (artwork: ArtworkRecord, withYear: boolean) => {
  const { title, material, width, height, _allReferencingCollections } = artwork
  const year = withYear ? _allReferencingCollections[0]?.year : undefined
  return [title, material, width && height ? `${width} × ${height}` : undefined, year].filter(el => el).join(', ')
}

export const transitionImage = async (image: HTMLImageElement, dImage: HTMLImageElement, dur: number = 600) => {

  const bounds = image.getBoundingClientRect();
  const dBounds = dImage.getBoundingClientRect();
  const easing = 'cubic-bezier(0.245, 0.765, 0.035, 0.920)'
  const { scrollY } = window;

  const clone = image.cloneNode(true) as HTMLImageElement;
  clone.style.position = 'absolute';
  clone.style.top = `${bounds.top + scrollY}px`;
  clone.style.left = `${bounds.left}px`;
  clone.style.width = `${bounds.width}px`;
  clone.style.height = `${bounds.height}px`;
  clone.style.objectFit = 'contain';
  clone.style.objectPosition = 'center';
  clone.style.zIndex = 'var(--z-trans-image)';
  clone.style.pointerEvents = 'none';
  clone.style.transition = ['top', 'left', 'width', 'height', 'opacity'].map(prop => `${prop} ${easing} ${dur}ms`).join(',');
  clone.style.opacity = '1';
  clone.style.willChange = 'top, left, width, height, opacity';
  document.body.appendChild(clone);

  await sleep(100)

  image.style.visibility = 'hidden';
  dImage.style.visibility = 'hidden';

  clone.style.top = `${scrollY + dBounds.top}px`;
  clone.style.left = `${dBounds.left}px`;
  clone.style.width = `${dBounds.width}px`;
  clone.style.height = `${dBounds.height}px`;

  await sleep(dur)

  image.style.visibility = 'visible';
  dImage.style.visibility = 'visible';
  clone.remove();
  return clone
}

export const transitionElement = async (el: HTMLElement, dEl: HTMLElement, dur: number = 600, topMargin: number = 0) => {

  const bounds = el.getBoundingClientRect();
  const dBounds = dEl.getBoundingClientRect();
  const easing = 'cubic-bezier(0.245, 0.765, 0.035, 0.920)'
  const clone = el.cloneNode(true) as HTMLElement;
  const { scrollY } = window;

  clone.style.position = 'absolute';
  clone.style.top = `${bounds.top + scrollY + topMargin}px`;
  clone.style.left = `${bounds.left}px`;
  clone.style.zIndex = 'var(--z-trans-image)';
  clone.style.transition = ['top', 'left', 'opacity'].map(prop => `${prop} ${easing} ${dur}ms`).join(',');
  clone.style.opacity = '1';
  clone.style.willChange = 'top, left, opacity';

  document.body.appendChild(clone);

  el.style.opacity = '0';
  dEl.style.opacity = '0';

  await sleep(100)

  clone.style.top = `${dBounds.top + scrollY + topMargin}px`;
  clone.style.left = `${dBounds.left}px`;

  await sleep(dur)

  el.style.opacity = '1';
  dEl.style.opacity = '1';
  clone.remove()

  return clone
}