import {state} from '../../../state/utils';
import {DataSlice, ApiDataSlice} from './template-slice';

export class TemplateTool {
  /**
   * Get all templates.
   */
  getTemplates(): DataSlice['data'] {
    return state().data;
  }

  async fetchData() {
    const response = await fetch('https://app.ecardwidget.com/api/templates');
    const data = (await response.json()) as ApiDataSlice;

    state().data.update?.(data);
  }

  resetData() {
    state().data.reset?.();
  }

  filterByCategory(category: string) {
    state().data.filterByCategory?.(category);
  }

  search(query: string) {
    const templates = state().data.templates;
    const trimmedQuery = query.trim().toLowerCase();
    const filteredTemplates = templates.filter(template => {
      const keywords = template.keywords.join(' ').toLowerCase();
      const category = template.categories.join(' ').toLowerCase();
      const name = template.name.toLowerCase();
      const description = template.description.toLowerCase();
      return (
        keywords.includes(trimmedQuery) ||
        category.includes(trimmedQuery) ||
        name.includes(trimmedQuery) ||
        description.includes(trimmedQuery)
      );
    });
    if (trimmedQuery !== '') state().data.updateSearched?.(filteredTemplates);
    else state().data.updateSearched?.(templates);
  }
}
