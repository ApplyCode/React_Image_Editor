import clsx from 'clsx';
import {FormattedMessage} from 'react-intl';
import {useStore} from '../../../state/store';
import {ActiveToolOverlay} from '../../../state/editor-state';
import {IconButton} from '../../../common/ui/buttons/icon-button';
import {filterNameMessages} from '../filter-list';
import {state, tools} from '../../../state/utils';
import {assetUrl} from '../../../utils/asset-url';
import {CancelIcon} from '../../../common/icons/material/Cancel';
import {TuneIcon} from '../../../common/icons/material/Tune';
import {ButtonBase} from '../../../common/ui/buttons/button-base';
import {useState} from 'react';

type FilterButtonProps = {
  filter: string;
};

export function FilterButton({filter}: FilterButtonProps) {
  const isActive = useStore(s => s.filter.applied.includes(filter));
  const hasOptions = tools().filter.hasOptions(filter);

  const className = clsx('block flex-shrink-0 rounded', {
    'text-primary border-primary': isActive,
  });

  const msg = filterNameMessages[filter];
  const content = (
    <>
      <div className="relative">
        <FilterImg filter={filter} />
        {isActive && <ActiveOverlay filter={filter} hasOptions={hasOptions} />}
      </div>
      <div className="mt-4 text-center text-xs capitalize">
        {msg ? <FormattedMessage {...msg} /> : filter}
      </div>
    </>
  );

  if (isActive && hasOptions) {
    return <div className={className}>{content}</div>;
  }
  return (
    <ButtonBase
      className={className}
      onPress={() => {
        if (isActive) {
          tools().filter.remove(filter);
        } else {
          tools().filter.apply(filter);
        }
      }}
    >
      {content}
    </ButtonBase>
  );
}

type FilterImgProps = {
  filter: string;
};

function FilterImg({filter}: FilterImgProps) {
  const isSelected = useStore(s => s.filter.selected === filter);
  const [error, setError] = useState(false);
  const className = clsx(
    'm-auto w-96 h-56 border text-xs flex text-center justify-center items-center rounded object-cover',
    {
      shadow: isSelected,
    }
  );
  return error ? (
    <div className={className}>{error} No Preview Available</div>
  ) : (
    <img
      src={assetUrl(`images/filter/${filter}.jpg`)}
      className={className}
      alt=""
      onError={() => setError(true)}
    />
  );
}

type ActiveOverlayProps = {
  hasOptions: boolean;
  filter: string;
};

function ActiveOverlay({filter, hasOptions}: ActiveOverlayProps) {
  const removeBtn = (
    <IconButton
      color="primary"
      size="md"
      onPress={() => {
        tools().filter.remove(filter);
      }}
    >
      <CancelIcon />
    </IconButton>
  );
  return (
    <div className="flex items-center justify-center bg-background/70 absolute inset-0 border-2 border-primary rounded">
      {hasOptions ? removeBtn : <CancelIcon className="svg-icon icon-md" />}
      {hasOptions && (
        <ToggleSettingsButton filter={filter} hasOptions={hasOptions} />
      )}
    </div>
  );
}

type ToggleSettingsButtonProps = {
  hasOptions: boolean;
  filter: string;
};

function ToggleSettingsButton({filter, hasOptions}: ToggleSettingsButtonProps) {
  return (
    <IconButton
      color="primary"
      size="md"
      onPress={() => {
        if (
          state().activeToolOverlay === ActiveToolOverlay.Filter &&
          state().filter.selected === filter
        ) {
          state().setActiveTool(state().activeTool, null);
        } else {
          state().filter.select(filter, hasOptions);
        }
      }}
    >
      <TuneIcon />
    </IconButton>
  );
}
