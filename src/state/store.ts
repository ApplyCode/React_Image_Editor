import create, {
  GetState,
  SetState,
  State,
  StateCreator,
  StoreApi,
} from 'zustand';
import {
  StoreApiWithSubscribeWithSelector,
  subscribeWithSelector,
} from 'zustand/middleware';
import produce, {castDraft, Draft} from 'immer';
import {DEFAULT_CONFIG} from '../config/default-config';
import {mergeConfig} from '../config/merge-config';
import {
  createHistorySlice,
  HistorySlice,
} from '../tools/history/state/history-slice';
import {createFilterSlice, FilterSlice} from '../tools/filter/filter-slice';
import {createCropSlice, CropSlice} from '../tools/crop/crop-slice';
import {createObjectsSlice, ObjectsSlice} from '../objects/state/objects-slice';
import {PlainRect} from '../common/utils/dom/get-bounding-client-rect';
import {createFrameSlice, FrameSlice} from '../tools/frame/frame-slice';
import {
  createResizeSlice,
  ResizeSlice,
} from '../tools/resize/state/resize-slice';
import {ActiveToolOverlay, EditorState} from './editor-state';
import {CornersSlice, createCornersSlice} from '../tools/corners/corners-slice';
import { ToolName } from '../tools/tool-name';
import { HistoryName } from '../tools/history/history-display-names';
import { createDataSlice, DataSlice } from '../tools/templates/state/template-slice';

export type StoreSlice<T> = (
  set: (
    partial: ((draft: Draft<PixieState>) => void) | Partial<PixieState>,
    replace?: boolean
  ) => void,
  get: GetState<PixieState>
) => T;

export type PixieState = EditorState &
  HistorySlice &
  ObjectsSlice &
  FilterSlice &
  CropSlice &
  FrameSlice &
  ResizeSlice &
  CornersSlice &
  DataSlice;

const EMPTY_PLAIN_RECT: PlainRect = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  width: 0,
  height: 0,
};

const immer =
  <
    T extends State,
    CustomSetState extends SetState<T>,
    CustomGetState extends GetState<T>,
    CustomStoreApi extends StoreApi<T>
  >(
    config: StateCreator<
      T,
      (
        partial: ((draft: Draft<T>) => void) | Partial<T>,
        replace?: boolean
      ) => void,
      CustomGetState,
      CustomStoreApi
    >
  ): StateCreator<T, CustomSetState, CustomGetState, CustomStoreApi> =>
  (set, get, api) =>
    config(
      (partial, replace) => {
        const nextState =
          typeof partial === 'function'
            ? produce(partial as (state: Draft<T>) => T)
            : (partial as T);
        return set(nextState, replace);
      },
      get,
      api
    );

export const useStore = create<
  PixieState,
  SetState<PixieState>,
  GetState<PixieState>,
  StoreApiWithSubscribeWithSelector<PixieState>
>(
  subscribeWithSelector(
    immer((set, get) => ({
      editor: null!,
      fabric: null!,
      config: DEFAULT_CONFIG,
      zoom: 1,
      dirty: false,
      original: {
        width: 1,
        height: 1,
      },
      stageSize: EMPTY_PLAIN_RECT,
      canvasSize: EMPTY_PLAIN_RECT,
      activeTool: null,
      activeToolOverlay: null,
      loading: false,
      replaced: false,
      panel: "default",
      bottomNav: false,
      openPanels: {
        newImage: false,
        history: false,
        objects: false,
        export: false,
      },
      ...createHistorySlice(set, get),
      ...createObjectsSlice(set, get),
      ...createFilterSlice(set, get),
      ...createCropSlice(set, get),
      ...createFrameSlice(set, get),
      ...createResizeSlice(set, get),
      ...createCornersSlice(set, get),
      ...createDataSlice(set, get),
      // actions
      setZoom: newZoom =>
        set(state => {
          state.zoom = newZoom;
        }),
      setBottomNav: (bottomNav: boolean) =>
        set(state => {
          state.bottomNav = bottomNav;
        }),
      setOriginal: (width, height) =>
        set(state => {
          state.original = {width, height};
        }),
      setDirty: isDirty =>
        set(state => {
          state.dirty = isDirty;
        }),
      toggleLoading: isLoading =>
        set(state => {
          state.loading = isLoading;
        }),
      setReplaced: replaced =>
        set(state => {
          state.replaced = replaced;
        }),
      setPanel: (panel: "default" | "newCanvas") => {
        set(state => {
          state.panel = panel;
        });
      },
      setStageSize: size =>
        set(state => {
          state.stageSize = size;
        }),
      setCanvasSize: size =>
        set(state => {
          state.canvasSize = size;
        }),
      setActiveTool: (toolName, overlay) =>
        set(state => {
          state.activeTool = toolName;
          state.activeToolOverlay = overlay;
        }),
      setConfig: partialConfig =>
        set(state => {
          console.log('partialConfig', partialConfig)
          state.config = castDraft(mergeConfig(partialConfig, get().config));
        }),
      togglePanel: (panelName, isOpen) =>
        set(state => {
          state.openPanels[panelName] = isOpen ?? !state.openPanels[panelName];
        }),

      applyChanges: async () => {
        let activeToolName:HistoryName | null = get().activeTool;
        if(activeToolName === ToolName.CHANGE_IMAGE) {
          const activeToolOverlay = get().activeToolOverlay;
          if(activeToolOverlay=== ActiveToolOverlay.Crop) {
            activeToolName = "crop";
          } else if(activeToolOverlay=== ActiveToolOverlay.Resize) {
            activeToolName = "resize";
          }
        }
        if (!activeToolName) return;

        // @ts-ignore
        const toolSlice = get()[activeToolName];

        const result = await toolSlice?.apply?.();

        set(state => {
          state.dirty = false;
          state.activeTool = null;
          state.activeToolOverlay = null;
        });

        // allow tools to prevent history item addition
        if (result !== false) {
          get().editor.tools.history.addHistoryItem({name: activeToolName});
        }

        toolSlice?.reset();
      },

      saveChanges: async () => {
        let activeToolName:HistoryName | null = get().activeTool;
        if(activeToolName === ToolName.CHANGE_IMAGE) {
          const activeToolOverlay = get().activeToolOverlay;
          if(activeToolOverlay=== ActiveToolOverlay.Crop) {
            activeToolName = "crop";
          } else if(activeToolOverlay=== ActiveToolOverlay.Resize) {
            activeToolName = "resize";
          }
        }
        if (!activeToolName) return;

        // @ts-ignore
        const toolSlice = get()[activeToolName];

        const result = await toolSlice?.apply?.();

        set(state => {
          state.dirty = false;
        });

        // allow tools to prevent history item addition
        if (result !== false) {
          get().editor.tools.history.addHistoryItem({name: activeToolName});
        }

        toolSlice?.reset();


      },


      cancelChanges: async () => {
        const activeToolName = get().activeTool;
        if (!activeToolName) return;
        const wasDirty = get().dirty;
        set(state => {
          state.dirty = false;
          state.activeTool = null;
          state.activeToolOverlay = null;
        });

        if (wasDirty && get().editor.state.history.items.at(-1)?.name !== "replaceImage") {
          await get().editor.tools.history.reload();
        }

        // @ts-ignore
        const toolSlice = get()[activeToolName];
        // run reset after history is loaded so too state can perform any needed changes.
        // Removing straighten anchor for example.
        toolSlice?.reset();
      },
      reset: () => {
        get().editor.tools.transform.resetStraightenAnchor();
        set({
          activeTool: null,
          activeToolOverlay: null,
          zoom: 1,
          dirty: false,
          loading: false,
          openPanels: {
            newImage: false,
            history: false,
            objects: false,
            export: false,
          },
        });
        get().history.reset();
        get().objects.reset();
        get().filter.reset();
        get().crop.reset();
        get().frame.reset();
        get().resize.reset();
        get().corners.reset();
      },
    }))
  )
);
