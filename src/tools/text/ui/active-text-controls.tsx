import {FormattedMessage} from 'react-intl';
import {Button} from '../../../common/ui/buttons/button';
import {ActiveObjectControls} from '../../../objects/ui/active-obj-controls/active-object-controls';
import {ToolControlsOverlayWrapper} from '../../../ui/navbar/tool-controls-overlay-wrapper';
import {state, tools} from '../../../state/utils';
import {useIsMobileMediaQuery} from '../../../common/utils/hooks/is-mobile-media-query';

export function ActiveTextControls() {
  const isMobile = useIsMobileMediaQuery();
  const actionBtn = !isMobile && (
    <Button
      size="sm"
      color="primary"
      variant="outline"
      onPress={async () => {
        tools().text.add();
        await state().saveChanges();
      }}
    >
      <FormattedMessage defaultMessage="New Text" />
    </Button>
  );
  return (
    <ToolControlsOverlayWrapper actionBtn={actionBtn}>
      <ActiveObjectControls />
    </ToolControlsOverlayWrapper>
  );
}
