import {SerializedPixieState} from '../history/serialized-pixie-state';

export async function fetchStateJsonFromUrl(
  url: string
): Promise<SerializedPixieState> {
  const response = await fetch(url);
  let res = await response.json();
  if (typeof res === 'string') {
    try { res = JSON.parse(res); } catch (error) {}
  }
  return res;
}
