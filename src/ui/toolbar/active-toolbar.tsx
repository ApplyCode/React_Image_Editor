import React from 'react';
import {m} from 'framer-motion';
import {FormattedMessage} from 'react-intl';
import {useStore} from '../../state/store';
import {IconButton} from '../../common/ui/buttons/icon-button';
import {ToolName} from '../../tools/tool-name';
import {CropInputFields} from '../../tools/crop/ui/crop-nav/crop-input-fields';
import {toolbarAnimation, toolbarStyle} from './toolbar-style';
import {state, tools} from '../../state/utils';
import {Button} from '../../common/ui/buttons/button';
import {CloseIcon} from '../../common/icons/material/Close';
import {CheckIcon} from '../../common/icons/material/Check';
import {useEditorMode} from '../editor-mode';
import clsx from 'clsx';

export function ActiveToolbar() {
  const activeTool = useStore(s => s.activeTool);
  return (
    <m.div className={clsx(toolbarStyle, 'border-b')} {...toolbarAnimation}>
      <CancelButton />
      {getToolName(activeTool)}
      <ApplyButton />
    </m.div>
  );
}

function CancelButton() {
  const {isMobile} = useEditorMode();
  const isDirty = useStore(s => s.dirty);
  if (isMobile) {
    return (
      <IconButton
        size="sm"
        onPress={() => {
          if (state().activeTool === ToolName.DRAW) {
            tools().draw.disable();
          }
          state().cancelChanges();
        }}
      >
        <CloseIcon />
      </IconButton>
    );
  }
  return (
    <Button
      variant="outline"
      size="xs"
      startIcon={<CloseIcon />}
      radius="rounded-full"
      onPress={() => {
        if (state().activeTool === ToolName.DRAW) {
          tools().draw.disable();
        }
        state().cancelChanges();
      }}
    >
      {isDirty ? (
        <FormattedMessage defaultMessage="Cancel" />
      ) : (
        <FormattedMessage defaultMessage="Back" />
      )}
    </Button>
  );
}

function getToolName(toolName: ToolName | null) {
  const defaultCmp = <div className="capitalize text-sm">{toolName}</div>;
  // switch (toolName) {
  //   case ToolName.CROP: {
  //     const allowCustom = state().config.tools?.crop?.allowCustomRatio ?? true;
  //     if (allowCustom) {
  //       return <CropInputFields />;
  //     }
  //     return defaultCmp;
  //   }
  //   default:
  return defaultCmp;
  // }
}

function ApplyButton() {
  const {isMobile} = useEditorMode();
  const isDirty = useStore(s => s.dirty);
  if (isMobile) {
    return (
      <IconButton
        size="sm"
        isDisabled={!isDirty}
        onPress={async () => {
          if (state().activeTool === ToolName.DRAW) {
            tools().draw.disable();
          }
          await state().applyChanges();
        }}
      >
        <CheckIcon />
      </IconButton>
    );
  }
  return (
    <Button
      variant="flat"
      color="primary"
      size="xs"
      isDisabled={!isDirty}
      startIcon={<CheckIcon />}
      radius="rounded-full"
      onPress={() => {
        if (state().activeTool === ToolName.DRAW) {
          tools().draw.disable();
        }
        state().applyChanges();
      }}
    >
      <FormattedMessage defaultMessage="Apply" />
    </Button>
  );
}
