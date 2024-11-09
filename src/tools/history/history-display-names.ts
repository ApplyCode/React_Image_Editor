import {ComponentType} from 'react';
import {defineMessage, MessageDescriptor} from 'react-intl';
import {ToolName} from '../tool-name';
import {TuneIcon} from '../../common/icons/material/Tune';
import {PhotoSizeSelectLargeIcon} from '../../common/icons/material/PhotoSizeSelectLarge';
import {CropIcon} from '../../common/icons/material/Crop';
import {TextFieldsIcon} from '../../common/icons/material/TextFields';
import {ExtensionIcon} from '../../common/icons/material/Extension';
import {FaceIcon} from '../../common/icons/material/Face';
import {FilterFramesIcon} from '../../common/icons/material/FilterFrames';
import {MergeIcon} from '../../common/icons/material/Merge';
import {RoundedCornerIcon} from '../../common/icons/material/RoundedCorner';
import {PhotoLibraryIcon} from '../../common/icons/material/PhotoLibrary';
import {HistoryIcon} from '../../common/icons/material/History';
import {StyleIcon} from '../../common/icons/material/Style';
import {DeleteIcon} from '../../common/icons/material/Delete';
import {SvgIconProps} from '../../common/icons/svg-icon';
import {DrawIcon} from '../../ui/icons/draw';
import {HomeIcon} from '../../common/icons/material/Home';
import {ImageIcon} from '../../common/icons/material/Image';
import {AccessibilityIcon} from '../../common/icons/material/Accessibility';

import { state } from '../../state/utils';

export const HISTORY_DISPLAY_NAMES: Record<
  HistoryName,
  {name: MessageDescriptor; icon: ComponentType<SvgIconProps>}
> = {
  [ToolName.FILTER]: {
    name: defineMessage({defaultMessage: 'Applied Filters'}),
    icon: TuneIcon,
  },
  [ToolName.DRAW]: {
    name: defineMessage({defaultMessage: 'Added Drawing'}),
    icon: DrawIcon,
  },
  [ToolName.TEXT]: {
    name: defineMessage({defaultMessage: 'Added Text'}),
    icon: TextFieldsIcon,
  },
  [ToolName.SHAPES]: {
    name: defineMessage({defaultMessage: 'Added Shape'}),
    icon: ExtensionIcon,
  },
  [ToolName.STICKERS]: {
    name: defineMessage({defaultMessage: 'Added Sticker'}),
    icon: FaceIcon,
  },
  [ToolName.FRAME]: {
    name: defineMessage({defaultMessage: 'Added Frame'}),
    icon: FilterFramesIcon,
  },
  [ToolName.FLATTEN]: {
    name: defineMessage({defaultMessage: 'Merged Objects'}),
    icon: MergeIcon,
  },
  [ToolName.CORNERS]: {
    name: defineMessage({defaultMessage: 'Rounded Corner'}),
    icon: RoundedCornerIcon,
  },
  [ToolName.CHANGE_IMAGE]: {
    name: defineMessage({defaultMessage: 'Changed Image'}),
    icon: PhotoLibraryIcon
  },
  [ToolName.ADD_IMAGE]: {
    name: defineMessage({defaultMessage: 'Insert Image'}),
    icon: ImageIcon
  },
  [ToolName.TEMPLATE]: {
    name: defineMessage({defaultMessage: 'Added Template'}),
    icon: AccessibilityIcon
  },
  bgImage: {
    name: defineMessage({defaultMessage: 'Replaced Background Image'}),
    icon: PhotoLibraryIcon,
  },
  overlayImage: {
    name: defineMessage({defaultMessage: 'Added Image'}),
    icon: PhotoLibraryIcon,
  },
  initial: {name: defineMessage({defaultMessage: 'Initial'}), icon: HomeIcon},
  loadedState: {
    name: defineMessage({defaultMessage: 'Loaded State'}),
    icon: HistoryIcon,
  },
  objectStyle: {
    name: defineMessage({defaultMessage: 'Changed Style'}),
    icon: StyleIcon,
  },
  deletedObject: {
    name: defineMessage({defaultMessage: 'Deleted object'}),
    icon: DeleteIcon,
  },
  replaceImage: {
    name: defineMessage({defaultMessage: 'Replaced Image'}),
    icon: HistoryIcon,
  },
  crop: {
    name: defineMessage({defaultMessage: 'Cropped Image'}),
    icon: CropIcon,
  },
  resize: {
    name: defineMessage({defaultMessage: 'Resized Image'}),
    icon: PhotoSizeSelectLargeIcon,
  },
};

export type HistoryName =
  | ToolName
  | 'initial'
  | 'loadedState'
  | 'bgImage'
  | 'overlayImage'
  | 'objectStyle'
  | 'deletedObject'
  | "replaceImage"
  | "crop"
  | "resize";
