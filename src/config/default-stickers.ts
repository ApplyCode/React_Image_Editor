import {defineMessages, MessageDescriptor} from 'react-intl';
import {emoticonsList} from './emoticons';

export interface StickerCategory {
  name: string;
  items?: number;
  list?: string[];
  type: 'svg' | 'png';
  thumbnailUrl?: string;
  invertPreview?: boolean;
}

export const defaultStickers: StickerCategory[] = [
  {
    name: 'emoticons',
    list: emoticonsList,
    type: 'svg',
    thumbnailUrl: 'images/stickers/categories/emoticon.svg',
  },
  {
    name: 'doodles',
    items: 100,
    type: 'svg',
    thumbnailUrl: 'images/stickers/categories/doodles.svg',
  },
  {
    name: 'landmarks',
    items: 100,
    type: 'svg',
    thumbnailUrl: 'images/stickers/categories/landmark.svg',
    invertPreview: true,
  },
  {
    name: 'bubbles',
    items: 104,
    type: 'png',
    thumbnailUrl: 'images/stickers/categories/speech-bubble.svg',
  },
  {
    name: 'transportation',
    items: 22,
    type: 'svg',
    thumbnailUrl: 'images/stickers/categories/transportation.svg',
    invertPreview: true,
  },
  {
    name: 'beach',
    items: 22,
    type: 'svg',
    thumbnailUrl: 'images/stickers/categories/beach.svg',
    invertPreview: true,
  },
];

export const StickerCategoryMessages: Record<string, MessageDescriptor> =
  defineMessages({
    emoticons: {
      defaultMessage: 'Emoticons',
      description: 'Sticker category name',
    },
    doodles: {
      defaultMessage: 'Doodles',
      description: 'Sticker category name',
    },
    landmarks: {
      defaultMessage: 'Landmarks',
      description: 'Sticker category name',
    },
    bubbles: {
      defaultMessage: 'Bubbles',
      description: 'Sticker category name',
    },
    transportation: {
      defaultMessage: 'Transportation',
      description: 'Sticker category name',
    },
    beach: {
      defaultMessage: 'Beach',
      description: 'Sticker category name',
    },
  });
