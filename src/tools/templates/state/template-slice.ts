import {castDraft} from 'immer';
import type {StoreSlice} from '../../../state/store';
import {state} from '../../../state/utils';
import {Template} from '../template-item.interface';

export interface DataSlice {
  data: {
    templates: Template[];
    categories: string[];
    filteredTemplates: Template[];
    selectedCategories: string[];
    loading: boolean;
    update?: (data: ApiDataSlice) => void;
    reset?: () => void;
    updateSearched?: (templates: Template[]) => void;
    filterByCategory?: (category: string) => void;
  };
}

export interface ApiDataSlice {
  templates: Template[];
  categories: string[];
}

export const DEFAULT_DATA: DataSlice['data'] = {
  templates: [],
  categories: [],
  filteredTemplates: [],
  selectedCategories: [],
  loading: true,
};

export const createDataSlice: StoreSlice<DataSlice> = (set, get) => ({
  data: {
    ...DEFAULT_DATA,
    update: (data: ApiDataSlice) =>
      set(state => {
        state.data.templates = castDraft(data.templates);
        state.data.categories = castDraft(data.categories);
        state.data.filteredTemplates = castDraft(data.templates);
        state.data.loading = false;
      }),
    updateSearched: (templates) => {
      set(state => {
        state.data.filteredTemplates = castDraft(templates);
      });
    },
    filterByCategory: (category) => {
      const categories = get().data.selectedCategories;
      let selectedCategories = [category];
      if(category == 'All') selectedCategories = [];
      const templates = get().data.templates;
      console.log(templates);
      const filteredTemplates = templates.filter(template => {
        return template.categories.some(category => selectedCategories.includes(category));
      });
      set(state => {
        state.data.selectedCategories = castDraft(selectedCategories);
        state.data.filteredTemplates = castDraft(filteredTemplates.length > 0 ? filteredTemplates : templates);
      });
    },
    reset: () => {
      set({data: {...get().data, ...DEFAULT_DATA}});
    },
  },
});
