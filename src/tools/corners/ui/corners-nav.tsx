import {useEffect} from 'react';
import {useIntl} from 'react-intl';
import {useStore} from '../../../state/store';
import {Slider} from '../../../common/ui/inputs/slider/slider';
import {state, tools} from '../../../state/utils';

export function CornersNav() {
  const intl = useIntl();
  const radius = useStore(s => s.corners.radius);

  useEffect(() => {
    state().saveChanges();
    tools().corners.showPreview();
    return () => tools().corners.hidePreview();
  }, []);

  return (
    <div className="max-w-320 w-full mx-auto">
      <Slider
        minValue={1}
        maxValue={300}
        label={intl.formatMessage({defaultMessage: 'Radius'})}
        getValueLabel={value => {
          return `${value}px`;
        }}
        onChange={val => {
          tools().corners.updatePreview(val);
          state().corners.setRadius(val);
        }}
        value={radius}
      />
    </div>
  );
}
