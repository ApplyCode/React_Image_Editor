import {useState} from 'react';
import {FormattedMessage} from 'react-intl';
import {useStore} from '../../../../state/store';
import {
  StickerCategory,
  StickerCategoryMessages,
} from '../../../../config/default-stickers';
import {ButtonGroup} from '../../../../common/ui/buttons/button-group';
import {Button} from '../../../../common/ui/buttons/button';
import {StickerList} from './sticker-list';
import {useMediaQuery} from '../../../../common/utils/hooks/use-media-query';
import {Picker} from '../../../../common/ui/inputs/select/picker';
import {Item} from '@react-stately/collections';
export function StickerNav() {
  const categories = useStore(s => s.config.tools?.stickers?.items) || [];
  const [selectedCategory, setSelectedCategory] =
    useState<StickerCategory | null>(categories[0]);
  const isLarge = useMediaQuery('(min-width: 640px)');
  const categoryBtns = categories.map(category => {
    const isSelected = selectedCategory === category;
    const msg = StickerCategoryMessages[category.name];
    return (
      <Button
        key={category.name}
        size="xs"
        color={isSelected ? 'primary' : null}
        value={category}
      >
        <span className="capitalize">
          {msg ? <FormattedMessage {...msg} /> : category.name}
        </span>
      </Button>
    );
  });

  return (
    <div className="sm:h-110 h-full flex-wrap flex-1 w-full pt-10">
      {isLarge ? (
        <ButtonGroup
          value={selectedCategory}
          onChange={newCategory => setSelectedCategory(newCategory)}
          className="mb-10 w-full justify-center"
          variant="outline"
          radius="rounded-full"
        >
          {categoryBtns}
        </ButtonGroup>
      ) : (
        <Picker
          items={categories.map(category => {
            const msg = StickerCategoryMessages[category.name];
            return {
              value: msg ? <FormattedMessage {...msg} /> : category.name,
              key: category,
            };
          })}
          value={selectedCategory}
          onChange={category => {
            setSelectedCategory(category as StickerCategory);
          }}
          className="mb-10 w-full justify-center"
        >
          {items => {
            return (
              <Item textValue={items.key.name}>
                <span>{items.value}</span>
              </Item>
            );
          }}
        </Picker>
      )}
      {selectedCategory && <StickerList category={selectedCategory} />}
    </div>
  );
}
