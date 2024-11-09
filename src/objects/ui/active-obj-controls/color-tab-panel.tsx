import React, {useState} from 'react';
import {fabric} from 'fabric';
import {Pattern} from 'fabric/fabric-impl';
import {FormattedMessage, useIntl} from 'react-intl';
import {useStore} from '../../../state/store';
import {ColorPickerButton} from '../../../ui/color-picker-button';
import {Button} from '../../../common/ui/buttons/button';
import {DEFAULT_GRADIENTS} from '../../../config/default-gradients';
import {DialogTrigger} from '../../../common/ui/overlays/dialog-trigger/dialog-trigger';
import {ButtonBase} from '../../../common/ui/buttons/button-base';
import {defaultObjectProps} from '../../../config/default-object-props';
import {state, tools} from '../../../state/utils';
import {TextureIcon} from '../../../common/icons/material/Texture';
import {GradientIcon} from '../../../common/icons/material/Gradient';
import {KeyboardArrowDownIcon} from '../../../common/icons/material/KeyboardArrowDown';
import {AddPhotoAlternateIcon} from '../../../common/icons/material/AddPhotoAlternate';
import {assetUrl} from '../../../utils/asset-url';
import {Dialog} from '../../../common/ui/overlays/dialog/dialog';
import clsx from 'clsx';
import GradientPickerPopup from '../../../common/ui/color-picker/gradient-picker';

interface Props {
  property: 'fill' | 'backgroundColor';
}

export function ColorTabPanel({property}: Props) {
  const {formatMessage} = useIntl();
  const currentColor = useStore(s => s.objects.active.editableProps[property]);

  return (
    <div className="flex gap-5 md:flex-col">
      <ColorPickerButton
        size="xs"
        placement="left top"
        aria-label={formatMessage({defaultMessage: 'Color'})}
        value={
          typeof currentColor === 'string'
            ? currentColor
            : defaultObjectProps.fill
        }
        fullWidth
        onChange={async newColor => {
          tools().objects.setValues({[property]: newColor});
          await state().saveChanges();
        }}
      />
      {/* {property === 'fill' && (
        <>
          <FillSelector type="gradient" property={property} />
          <FillSelector type="texture" property={property} />
        </>
      )} */}
    </div>
  );
}

interface FillSelectorProps extends Props {
  type: 'gradient' | 'texture';
}

function FillSelector({type, property}: FillSelectorProps) {
  const startIcon = type === 'texture' ? <TextureIcon /> : <GradientIcon />;
  return (
    <>
      <DialogTrigger type="popover">
        <Button
          id={`${type}-panel-trigger`}
          variant="outline"
          size="xs"
          startIcon={startIcon}
          endIcon={<KeyboardArrowDownIcon />}
        >
          <span className="capitalize">
            {type === 'gradient' ? (
              <FormattedMessage defaultMessage="Gradient" />
            ) : (
              <FormattedMessage defaultMessage="Texture" />
            )}
          </span>
        </Button>
        {dialogState => {
          return (
            <Dialog>
              <div className="grid gap-8 grid-cols-5-min-content p-10 bg-paper rounded shadow-md">
                <PreviewButtons
                  property={property}
                  closeOverlay={dialogState.close}
                  type={type}
                />
              </div>
            </Dialog>
          );
        }}
      </DialogTrigger>
    </>
  );
}

interface PreviewButtonsProps extends FillSelectorProps {
  closeOverlay: () => void;
}

function PreviewButtons({closeOverlay, type, property}: PreviewButtonsProps) {
  const iterator = Array.from(
    Array(type === 'gradient' ? DEFAULT_GRADIENTS.length : 28).keys()
  );
  const previewBtnClass = 'w-56 h-56 bg border shadow-sm hover:scale-110';

  const previewBtns = iterator.map(index => {
    const previewUrl = assetUrl(`images/${type}s/${index}.png`);
    const g = DEFAULT_GRADIENTS[index];
    if (type === 'gradient' && g === undefined) return null;
    const bgButton =
      type === 'gradient'
        ? `linear-gradient(to left bottom, ${g.colorStops
            ?.map(({color, offset}) => `${color} ${+offset * 100}%`)
            .join(', ')})`
        : undefined;
    return (
      <ButtonBase
        radius="rounded"
        className={clsx(
          previewBtnClass,
          type === 'gradient' &&
            index === iterator.length - 1 &&
            `after:w-2 relative after:h-full after:absolute after:top-1/2 after:left-1/2 after:rotate-45 after:-translate-x-1/2 after:-translate-y-1/2 after:bg-red`
        )}
        key={index}
        style={{
          backgroundImage:
            type === 'gradient' && index === iterator.length - 1
              ? ''
              : type === 'gradient'
              ? bgButton
              : `url(${previewUrl})`,
          border:
            type === 'gradient' && index === iterator.length - 1
              ? '2px solid red'
              : 'initial',
        }}
        aria-label={`Select ${type} #${index}`}
        onPress={async () => {
          closeOverlay();
          const value =
            type === 'gradient'
              ? new fabric.Gradient(DEFAULT_GRADIENTS[index])
              : await patternFromUrlOrData(previewUrl);
          tools().objects.setValues({[property]: value});
          await state().saveChanges();
        }}
      />
    );
  });

  if (type === 'texture') {
    previewBtns.unshift(
      <UploadButton
        property={property}
        closeOverlay={closeOverlay}
        key="upload-btn"
        className={previewBtnClass}
      />
    );
  }
  return (
    <>
      {previewBtns}
      <GradientPickerPopup property={property} type={type} />
    </>
  );
}

interface UploadButtonProps extends Props {
  className: string;
  closeOverlay: () => void;
}

function UploadButton({className, closeOverlay, property}: UploadButtonProps) {
  return (
    <ButtonBase
      radius="rounded"
      className={className}
      aria-label="Upload an image"
      onPress={async () => {
        const file = await tools().import.openUploadWindow();
        closeOverlay();
        if (file) {
          const pattern = await patternFromUrlOrData(await file.data);
          tools().objects.setValues({[property]: pattern});
        }
      }}
    >
      <AddPhotoAlternateIcon className="icon-md" />
    </ButtonBase>
  );
}

function patternFromUrlOrData(data: string): Promise<Pattern> {
  return new Promise(resolve => {
    fabric.util.loadImage(data, img => {
      const pattern = new fabric.Pattern({
        source: img,
        repeat: 'repeat',
      });
      resolve(pattern);
    });
  });
}
