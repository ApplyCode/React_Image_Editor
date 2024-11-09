import React, {FC, HTMLAttributes, useState} from 'react';
import {Item} from '@react-stately/collections';
import {FormattedMessage} from 'react-intl';
import {TabList} from '../../../common/ui/tabs/tab-list';
import {Tabs} from '../../../common/ui/tabs/tabs';
import {TextStyleTabPanel} from './text-style-tab-panel';
import {TabPanels} from '../../../common/ui/tabs/tab-panels';
import {OpacityTabPanel} from './opacity-tab-panel';
import {OutlineTabPanel} from './outline-tab-panel';
import {useStore} from '../../../state/store';
import {ImageTabPanel} from './image-tab-panel';
import {ShadowTabPanel} from './shadow-tab-panel';
import clsx from 'clsx';
import {AnimatePresence, m} from 'framer-motion';
import {useIsMobileMediaQuery} from '../../../common/utils/hooks/is-mobile-media-query';

export function ActiveObjectControls() {
  const active = useStore(s => s.objects.active);
  const isMobile = useIsMobileMediaQuery();
  return isMobile ? (
    <Tabs size="sm" className="pb-18 pt-6">
      <TabList>
        {active.isText && (
          <Item key="font">
            <FormattedMessage defaultMessage="Font" />
          </Item>
        )}
        {/* Hidden */}
        {/* {!active.isImage && !(active.name === 'sticker') && (
          <Item key="bgColor">
            <FormattedMessage defaultMessage="Background" />
          </Item>
        )} */}
        {active.isImage && (
          <Item key="image">
            <FormattedMessage defaultMessage="Image" />
          </Item>
        )}
        <Item key="opacity">
          <FormattedMessage defaultMessage="Opacity" />
        </Item>
        {active.name === 'sticker' ? (
          ''
        ) : (
          <Item key="outline">
            <FormattedMessage defaultMessage="Outline" />
          </Item>
        )}
        <Item key="shadow">
          <FormattedMessage defaultMessage="Shadow" />
        </Item>
      </TabList>
      <TabPanels className="flex items-center justify-center gap-10 pt-16 h-50 w-full">
        <Item key="font">
          <TextStyleTabPanel />
        </Item>
        {/* Hidden */}
        {/* <Item key="bgColor">
          <ColorTabPanel property="backgroundColor" />
        </Item> */}
        <Item key="image">
          <ImageTabPanel />
        </Item>
        <Item key="opacity">
          <OpacityTabPanel />
        </Item>
        <Item key="outline">
          <OutlineTabPanel />
        </Item>
        <Item key="shadow">
          <ShadowTabPanel />
        </Item>
      </TabPanels>
    </Tabs>
  ) : (
    <div className="p-20">
      {active.isText && (
        <Accordion text={<FormattedMessage defaultMessage="Font" />}>
          <TextStyleTabPanel />
        </Accordion>
      )}
      {/* Hidden */}
      {/* {!active.isImage && !(active.name === 'sticker') && (
        <Accordion text={<FormattedMessage defaultMessage="Background" />}>
          <ColorTabPanel property="backgroundColor" />
        </Accordion>
      )} */}
      {active.isImage && (
        <Accordion text={<FormattedMessage defaultMessage="Image" />}>
          <ImageTabPanel />
        </Accordion>
      )}
      <Accordion text={<FormattedMessage defaultMessage="Opacity" />}>
        <OpacityTabPanel />
      </Accordion>
      {active.name === 'sticker' ? (
        ''
      ) : (
        <Accordion text={<FormattedMessage defaultMessage="Outline" />}>
          <OutlineTabPanel />
        </Accordion>
      )}
      <Accordion text={<FormattedMessage defaultMessage="Shadow" />}>
        <ShadowTabPanel />
      </Accordion>
    </div>
  );
}

type AccordionProps = HTMLAttributes<HTMLElement> & {text?: React.ReactNode};

const Accordion: FC<AccordionProps> = ({children, text = '', ...props}) => {
  const [open, setOpen] = useState(false);
  return (
    <div {...props}>
      <div
        onClick={() => setOpen(!open)}
        className={clsx(
          'border-b-2 p-8 text-center',
          open && 'border-b-primary text-primary'
        )}
      >
        {text}
      </div>
      <AnimatePresence>
        {open && (
          <m.div
            initial={{height: 0, overflowY: 'hidden'}}
            animate={{height: 'auto', overflowY: 'hidden'}}
            transition={{duration: 0.2}}
            exit={{height: 0, overflowY: 'hidden'}}
            className="p-10"
          >
            {children}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};
