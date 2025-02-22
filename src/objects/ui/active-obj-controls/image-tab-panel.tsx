import {Image} from 'fabric/fabric-impl';
import {FormattedMessage} from 'react-intl';
import {Button} from '../../../common/ui/buttons/button';
import {fireObjModifiedEvent} from '../../object-modified-event';
import {ImageIcon} from '../../../common/icons/material/Image';
import {tools} from '../../../state/utils';

export function ImageTabPanel() {
  return (
    <div className="text-center">
      <Button
        type="button"
        variant="outline"
        size="xs"
        startIcon={<ImageIcon />}
        radius="rounded-full"
        onPress={async () => {
          const file = await tools().import.openUploadWindow();
          if (file) {
            const active = tools().objects.getActive();
            if (active && 'setSrc' in active) {
              const fileData = await file.data;
              (active as Image).setSrc(fileData, () => {
                fireObjModifiedEvent({
                  src: fileData,
                });
                tools().canvas.render();
              });
            }
          }
        }}
      >
        <FormattedMessage defaultMessage="Replace Image" />
      </Button>
    </div>
  );
}
