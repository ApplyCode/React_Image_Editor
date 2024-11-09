import {FormattedMessage, useIntl} from 'react-intl';
import React, {useRef, useState} from 'react';
import {Button} from '../common/ui/buttons/button';
import {useStore} from '../state/store';
import {Dialog} from '../common/ui/overlays/dialog/dialog';
import {DialogHeader} from '../common/ui/overlays/dialog/dialog-header';
import {DialogBody} from '../common/ui/overlays/dialog/dialog-body';
import {DialogTrigger} from '../common/ui/overlays/dialog-trigger/dialog-trigger';
import {ColorPickerButton} from './color-picker-button';
import {NumberField} from '../common/ui/inputs/input-field/number-field';
import {fabricCanvas, state, tools} from '../state/utils';
import {fetchStateJsonFromUrl} from '../tools/import/fetch-state-json-from-url';
import {assetUrl} from '../utils/asset-url';
import {IconButton} from '../common/ui/buttons/icon-button';
import {CloseIcon} from '../common/icons/material/Close';
import {canvasIsEmpty} from '../tools/canvas/canvas-is-empty';
import {resetEditor} from '../utils/reset-editor';

type ActivePanel = 'default' | 'newCanvas';

export function NewImageDialogTrigger() {
  const isOpen = useStore(s => s.openPanels.newImage);

  return (
    <DialogTrigger
      isOpen={isOpen}
      disableInitialTransition
      type="modal"
      isDismissable={false}
    >
      <NewImageDialog />
    </DialogTrigger>
  );
}

function NewImageDialog() {
  const activePanel = useStore(s => s.panel);
  return (
    <Dialog className="p-20 text-center max-w-max">
      <div className="w-full text-right">
        {!canvasIsEmpty() && (
          <IconButton
            size="md"
            onPress={() => {
              state().togglePanel('newImage', false);
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </div>
      <DialogHeader className="pb-20 flex justify-between items-center">
        <FormattedMessage defaultMessage="Open a photo or design to get started" />
      </DialogHeader>
      <DialogBody>
        {activePanel === 'default' ? (
          <DefaultPanel setActivePanel={state().setPanel} />
        ) : (
          <NewCanvasPanel setActivePanel={state().setPanel} />
        )}
      </DialogBody>
    </Dialog>
  );
}

type PanelProps = {
  setActivePanel: (panel: ActivePanel) => void;
};

function DefaultPanel({setActivePanel}: PanelProps) {
  return (
    <>
      <Button
        className="mr-20"
        size="sm"
        variant="raised"
        color="primary"
        onPress={() => {
          tools().import.uploadAndReplaceMainImage();
        }}
      >
        <FormattedMessage defaultMessage="Open Photo" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        color="primary"
        onPress={() => {
          setActivePanel('newCanvas');
        }}
      >
        <FormattedMessage defaultMessage="Create New" />
      </Button>
      <SampleImagesPanel />
    </>
  );
}

function SampleImagesPanel() {
  const sampleImages = useStore(
    s => s.config.ui?.openImageDialog?.sampleImages
  );
  if (!sampleImages?.length) return null;
  return (
    <>
      <div className="relative py-20">
        <hr className="absolute h-1 border-none bg-divider w-full top inset-0 m-auto" />
        <span className="text-sm bg-paper px-6 relative">
          <FormattedMessage defaultMessage="or use sample" />
        </span>
      </div>
      <ul className="flex items-center gap-16">
        {sampleImages.map(img => (
          <li className="shrink-0" key={img.url || img.thumbnail}>
            <button
              type="button"
              onClick={async () => {
                if (typeof img.action === 'function') {
                  img.action();
                } else if (img.url.endsWith('.json')) {
                  await fetchStateJsonFromUrl(assetUrl(img.url));
                  state().togglePanel('newImage', false);
                } else {
                  await tools().import.openBackgroundImage(assetUrl(img.url));
                  setTimeout(() => {
                    state().togglePanel('newImage', false);
                  }, 100);
                }
              }}
            >
              <img
                className="w-80 h-80 rounded overflow-hidden transition-shadow hover:shadow-md"
                src={assetUrl(img.thumbnail)}
                alt=""
              />
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

function NewCanvasPanel({setActivePanel}: PanelProps) {
  const [formVal, setFormVal] = useState<{
    width: number;
    height: number;
    bgColor: string;
  }>({
    width: 800,
    height: 600,
    bgColor: 'rgb(255, 255, 255)',
  });
  const {formatMessage} = useIntl();

  return (
    <form
      onSubmit={async e => {
        e.preventDefault();
        const {width, height, bgColor} = formVal;
        if (width && height) {
          await resetEditor();
          fabricCanvas().clear();
          tools().frame.remove();
          tools().transform.resetStraightenAnchor();
          state().setConfig({
            blankCanvasSize: {width, height},
            image: undefined,
          });
          tools().canvas.openNew(width, height, bgColor);
          state().togglePanel('newImage', false);
          tools().history.addInitial();
        }
      }}
    >
      <NumberField
        label={<FormattedMessage defaultMessage="Width" />}
        value={formVal.width}
        minValue={1}
        isRequired
        className="mb-16"
        onChange={width => {
          setFormVal({...formVal, width});
        }}
      />
      <NumberField
        label={<FormattedMessage defaultMessage="Height" />}
        value={formVal.height}
        minValue={1}
        isRequired
        className="mb-16"
        onChange={height => {
          setFormVal({...formVal, height});
        }}
      />
      <ColorPickerButton
        onChange={bgColor => {
          setFormVal({...formVal, bgColor});
        }}
        size="sm"
        className="mb-16"
        aria-label={formatMessage({defaultMessage: 'Background Color'})}
        value={formVal.bgColor}
        label={<FormattedMessage defaultMessage="Background color" />}
      />
      <div className="text-right">
        <Button
          size="sm"
          variant="text"
          className="mr-10"
          onPress={() => {
            setActivePanel('default');
          }}
        >
          <FormattedMessage defaultMessage="Cancel" />
        </Button>
        <Button size="sm" type="submit" variant="raised" color="primary">
          <FormattedMessage defaultMessage="Create" />
        </Button>
      </div>
    </form>
  );
}
