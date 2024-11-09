import {FormattedMessage} from 'react-intl';
import React, {useState} from 'react';
import {useStore} from '../../state/store';
import {DialogTrigger} from '../../common/ui/overlays/dialog-trigger/dialog-trigger';
import {Dialog} from '../../common/ui/overlays/dialog/dialog';
import {DialogBody} from '../../common/ui/overlays/dialog/dialog-body';
import {TextField} from '../../common/ui/inputs/input-field/text-field';
import {state, tools} from '../../state/utils';
import {Slider} from '../../common/ui/inputs/slider/slider';
import {Button} from '../../common/ui/buttons/button';
import {RadioGroup} from '../../common/ui/inputs/radio-group/radio-group';
import {Radio} from '../../common/ui/inputs/radio-group/radio';

export function ExportDialogTrigger() {
  const isOpen = useStore(s => s.openPanels.export);
  return (
    <DialogTrigger
      isOpen={isOpen}
      onClose={() => {
        state().togglePanel('export', false);
      }}
      type="modal"
    >
      <ExportDialog />
    </DialogTrigger>
  );
}

function ExportDialog() {
  const [formVal, setFormVal] = useState(() => {
    return {
      filename: state().config.tools?.export?.defaultName || 'image',
      format: state().config.tools?.export?.defaultFormat || 'jpeg',
      quality: state().config.tools?.export?.defaultQuality || 0.8,
    };
  });
  return (
    <Dialog className="p-20 text-center max-w-max">
      <DialogBody>
        <form
          onSubmit={e => {
            e.preventDefault();
            tools().export.save(
              formVal.filename,
              formVal.format,
              formVal.quality
            );
            state().togglePanel('export', false);
          }}
        >
          <TextField
            isRequired
            size="sm"
            label={<FormattedMessage defaultMessage="Save As" />}
            value={formVal.filename}
            onChange={filename => {
              setFormVal({...formVal, filename});
            }}
          />
          <RadioGroup
            size="sm"
            className="my-20"
            aria-label="Image format"
            value={formVal.format}
            onChange={format => {
              setFormVal({...formVal, format: format as any});
            }}
          >
            <Radio value="jpeg">JPEG</Radio>
            <Radio value="png">PNG</Radio>
            <Radio value="json">JSON</Radio>
          </RadioGroup>
          <Slider
            size="sm"
            minValue={0.1}
            step={0.1}
            maxValue={1}
            value={formVal.quality}
            onChange={quality => {
              setFormVal({...formVal, quality});
            }}
            formatOptions={{style: 'percent'}}
            label={<FormattedMessage defaultMessage="Quality" />}
          />
          <Button
            variant="raised"
            color="primary"
            type="submit"
            className="mt-20 w-full"
            size="sm"
          >
            <FormattedMessage defaultMessage="Save" />
          </Button>
        </form>
      </DialogBody>
    </Dialog>
  );
}
