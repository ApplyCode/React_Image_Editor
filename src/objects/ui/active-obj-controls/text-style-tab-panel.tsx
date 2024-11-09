import React, {useState} from 'react';
import {useIntl} from 'react-intl';
import {useStore} from '../../../state/store';
import {ButtonGroup} from '../../../common/ui/buttons/button-group';
import {IconButton} from '../../../common/ui/buttons/icon-button';
import {NumberField} from '../../../common/ui/inputs/input-field/number-field';
import {state, tools} from '../../../state/utils';
import {FormatUnderlinedIcon} from '../../../common/icons/material/FormatUnderlined';
import {FormatStrikethroughIcon} from '../../../common/icons/material/FormatStrikethrough';
import {FormatItalicIcon} from '../../../common/icons/material/FormatItalic';
import {FormatAlignRightIcon} from '../../../common/icons/material/FormatAlignRight';
import {FormatAlignLeftIcon} from '../../../common/icons/material/FormatAlignLeft';
import {FormatAlignCenterIcon} from '../../../common/icons/material/FormatAlignCenter';
import { ColorTabPanel } from './color-tab-panel';
export function TextStyleTabPanel() {
  return (
    <div className="flex gap-20 w-full justify-center md:flex-col items-center">
      <AlignmentSelector />
      <StyleSelector />
      <ColorTabPanel property="fill" />
      {/* <FontSizeSelector /> */}
    </div>
  );
}

function FontSizeSelector() {
  const fontSize = useStore(s => s.objects.active.editableProps.fontSize) ?? 40;
  const {formatMessage} = useIntl();
  return (
    <NumberField
      size="xs"
      aria-label={formatMessage({defaultMessage: 'Font Size'})}
      minValue={1}
      maxValue={300}
      className="w-64 flex-shrink-0"
      value={fontSize}
      onChange={async value => {
        tools().objects.setValues({
          fontSize: value,
        });
        await state().saveChanges();
      }}
    />
  );
}

function StyleSelector() {
  const fontStyle = useStore(s => s.objects.active.editableProps.fontStyle);
  const underline = useStore(s => s.objects.active.editableProps.underline);
  const linethrough = useStore(s => s.objects.active.editableProps.linethrough);

  const [styles, setStyles] = useState([
    fontStyle,
    underline && 'underline',
    linethrough && 'linethrough',
  ]);

  return (
    <ButtonGroup
      size="xs"
      variant="outline"
      radius="rounded"
      value={styles}
      multiple
      onChange={async (newStyles: string[]) => {
        setStyles(newStyles);
        tools().objects.setValues({
          underline: newStyles.includes('underline'),
          linethrough: newStyles.includes('linethrough'),
          fontStyle: newStyles.includes('italic') ? 'italic' : '',
        });
        await state().saveChanges();
      }}
    >
      <IconButton value="underline">
        <FormatUnderlinedIcon />
      </IconButton>
      <IconButton value="linethrough">
        <FormatStrikethroughIcon />
      </IconButton>
      <IconButton value="italic">
        <FormatItalicIcon />
      </IconButton>
    </ButtonGroup>
  );
}

function AlignmentSelector() {
  const textAlign = useStore(s => s.objects.active.editableProps.textAlign);
  return (
    <ButtonGroup
      size="xs"
      variant="outline"
      radius="rounded"
      value={textAlign}
      onChange={async newAlign => {
        tools().objects.setValues({
          textAlign: newAlign,
        });
        await state().saveChanges();
      }}
    >
      <IconButton value="left">
        <FormatAlignLeftIcon />
      </IconButton>
      <IconButton value="center">
        <FormatAlignCenterIcon />
      </IconButton>
      <IconButton value="right">
        <FormatAlignRightIcon />
      </IconButton>
    </ButtonGroup>
  );
}
