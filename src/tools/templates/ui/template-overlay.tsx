import React, {useEffect, FC, useState} from 'react';
import {m} from 'framer-motion';
import {state, tools} from '../../../state/utils';
import {useStore} from '../../../state/store';
import {PopoverTrigger} from '../../../common/ui/overlays/popover/popover-trigger';
import {Template} from '../template-item.interface';
import {TextField} from '../../../common/ui/inputs/input-field/text-field';
import { NativeSelect } from '../../../common/ui/inputs/select/native-select';
const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
];
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

const TemplateOverlay = () => {
  const {
    filteredTemplates,
    templates,
    categories,
    selectedCategories,
    loading,
  } = useStore(s => s.data);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  useEffect(() => {
    tools().data.search(debouncedSearch);
  }, [debouncedSearch]);
  useEffect(() => {
    if (templates.length === 0) {
      tools().data.fetchData();
    }
  }, [templates]);
  console.log(selectedCategories);
  return (
    <m.div
      key="template-overlay"
      className="fixed overflow-hidden cursor-auto inset-0 sm:left-86"
    >
      <m.div
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        transition={{duration: 0.2}}
        key="backdrop"
        onClick={() => state().setActiveTool(null, null)}
        className="absolute cursor-pointer inset-0 bg-black bg-opacity-25"
      ></m.div>
      {/* Create a sidebar */}
      <m.div
        initial={{x: '-100%'}}
        animate={{x: 0}}
        key="sidebar"
        exit={{x: '-100%'}}
        transition={{duration: 0.2, delay: 0.2}}
        className="w-[90%] tiny-scrollbar overflow-y-auto pb-20 relative max-w-[350px] bg-[#f9f9f9] h-full rounded-tr-xl rounded-br-xl"
      >
        <div className="top shadow sticky top-0 bg-white z-20 pb-10 pt-20 mb-10">
          <h1 className="text-2xl font-bold text-center pb-5">
            <span className="text-[#555]">Templates</span>
          </h1>
          <div className="px-10">
            <TextField
              placeholder="Search templates"
              label="Search templates"
              value={search}
              onChange={setSearch}
            />
          </div>
          <div className="px-10 pt-16">
            <NativeSelect
              label="Filter by Category"
              value={selectedCategories[0] || 'All'}
              onChange={(event) => {
                tools().data.filterByCategory(event.target.value)
              }}
            >
              <option key='All' value='All'>
                All
              </option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </NativeSelect>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="loader"></div>
          </div>
        ) : (
          <div className="templates-grid px-10 grid grid-cols-3 gap-5 w-full">
            {templates
              .filter(e => {
                return (
                  e.name.toLowerCase().includes(search.toLowerCase()) ||
                  e.description.toLowerCase().includes(search.toLowerCase()) ||
                  e.categories.some(c =>
                    c.toLowerCase().includes(search.toLowerCase())
                  ) ||
                  e.keywords.some(c =>
                    c.toLowerCase().includes(search.toLowerCase())
                  ) ||
                  e.description.toLowerCase().includes(search.toLowerCase())
                );
              })
              .filter(el => {
                return (
                  selectedCategories.length === 0 ||
                  el.categories.some(c => selectedCategories.includes(c))
                );
              })
              .map((template, i) => (
                <TemplateCard key={i} i={i} template={template} />
              ))}
          </div>
        )}
      </m.div>
    </m.div>
  );
};

const TemplateCard: FC<{
  template: Template;
  i: number;
}> = ({template, i}) => {
  const [isHovered, setIsHovered] = useState(false);
  const open = () => setIsHovered(true);
  const close = () => setIsHovered(false);
  const toggle = () => setIsHovered(h => !h);
  return (
    <m.div
      key={template.id}
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.2, delay: 0.2 + i * 0.1}}
      className="relative bg-white template-col rounded-xl shadow-sm cursor-pointer"
    >
      <PopoverTrigger
        trigger={
          <div
            onMouseEnter={open}
            onMouseLeave={close}
            className="absolute top-0 right-0 p-5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24 text-[#555]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
          </div>
        }
        placement={'top start'}
        state={{isOpen: isHovered, open, close, toggle}}
      >
        <div className="min-w-[250px] p-20 rounded-lg">
          <div className="text-sm font-bold">{template.name}</div>
          <div className="text-xs text-[#555]">{template.description}</div>
        </div>
      </PopoverTrigger>
      <div className="flex flex-col items-center">
        <div
          onClick={() => {
            tools().import.loadState(template.config);
          }}
          className="w-full rounded-xl overflow-hidden"
        >
          <img
            onError={function (e) {
              // @ts-ignore
              e.target.src =
                'https://www.freeiconspng.com/thumbs/error-icon/error-icon-32.png';
              // @ts-ignore
              e.target.title = 'Error: Failed to load image';
            }}
            src={template.thumbnail}
            loading="lazy"
            alt={template.name}
            className="object-cover object-center"
          />
        </div>
      </div>
    </m.div>
  );
};

export default TemplateOverlay;
