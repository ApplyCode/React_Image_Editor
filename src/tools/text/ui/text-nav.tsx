import {useEffect} from 'react';
import clsx from 'clsx';
import {
  ScrollableView,
  ScrollableViewItem,
} from '../../../ui/navbar/scrollable-view';
import {useStore} from '../../../state/store';
import {loadFonts} from '../../../common/ui/font-picker/load-fonts';
import {FontFaceConfig} from '../../../common/ui/font-picker/font-face-config';
import {state, tools} from '../../../state/utils';
import {Button} from '../../../common/ui/buttons/button';

export function TextNav() {
  const fonts = useStore(s => s.config.tools?.text?.items);

  // load fonts into dom
  useEffect(() => {
    if (fonts) {
      loadFonts(fonts);
    }
  }, [fonts]);

  // add text to canvas on text nav open
  useEffect(() => {
    if (!state().objects.active.isText) {
      tools().text.add();
      state().saveChanges();
    }
  }, []);

  const fontButtons = (fonts || []).map(fontConfig => {
    return (
      <ScrollableViewItem key={fontConfig.family}>
        <FontButton fontConfig={fontConfig} />
      </ScrollableViewItem>
    );
  });

  return (
    <div className="w-full">
      <ScrollableView className="sm:pt-6 pt-20 pb-20 sm:pb-0 flex-row h-full overflow-y-hidden overflow-x-auto flex-nowrap">
        {fontButtons}
      </ScrollableView>
      <Button
        className="sm:hidden mt-5 sm:mt-0"
        variant={'raised'}
        color={'primary'}
        size={'md'}
        onPress={() => {
          state().setBottomNav(false);
        }}
      >
        Customize
      </Button>
    </div>
  );
}

type FontButtonProps = {
  fontConfig: FontFaceConfig;
};

function FontButton({fontConfig}: FontButtonProps) {
  const selectedFont = useStore(s => s.objects.active.editableProps.fontFamily);

  const className = clsx(
    'block px-6 w-110 h-68 text-sm bg border rounded-2xl',
    {
      'border-primary': selectedFont === fontConfig.family,
      'text-primary': selectedFont === fontConfig.family,
    }
  );
  return (
    <button
      type="button"
      className={className}
      ref={(node) => {
        if (node) {
          node.style.setProperty("font-family", fontConfig.family, "important");
        }
      }}
      style={{
        fontWeight: fontConfig.descriptors?.weight || 'normal',
      }}
      onClick={async () => {
        if (!state().objects.active.isText) {
          tools().text.add();
        }
        await state().saveChanges();
        tools().objects.setValues({
          fontFamily: fontConfig.family,
        });
      }}
    >
      {fontConfig.family}
    </button>
  );
}
