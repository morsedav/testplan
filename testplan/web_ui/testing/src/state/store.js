import { configureStore } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import { combineReducers } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import { getDefaultMiddleware } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import { isImmutableDefault } from '@reduxjs/toolkit/dist/redux-toolkit.esm';
import { setUseProxies } from 'immer/dist/immer.esm';
import { enableMapSet } from 'immer/dist/immer.esm';
import appSlice from './appSlice';
import appMiddleware from './appMiddleware';
import uiSlice from '../Report/BatchReport/state/uiSlice';
import uiMiddleware from '../Report/BatchReport/state/uiMiddleware';
import reportSlice from '../Report/BatchReport/state/reportSlice';

const __DEV__ = process.env.NODE_ENV !== 'production';
const ALLOW_MAP_SET = true;
setUseProxies(true);
if(ALLOW_MAP_SET) enableMapSet();

const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    ui: uiSlice.reducer,
    report: reportSlice.reducer,
  },
  middleware: [
    appMiddleware,
    uiMiddleware,
    ...getDefaultMiddleware({
      thunk: {
        extraArgument: { },
      },
      serializableCheck: __DEV__,
      immutableCheck: __DEV__ && {
        isImmutable: value =>
          ALLOW_MAP_SET && (value instanceof Set || value instanceof Map)
            ? ALLOW_MAP_SET
            : isImmutableDefault(value)
      },
    }),
  ]
});

if (__DEV__ && module && module.hot) {
  module.hot.accept(
    [
      '../Report/BatchReport/state/uiSlice',
      './appSlice',
      '../Report/BatchReport/state/reportSlice'
    ],
    () => {
      // eslint-disable-next-line max-len
      const {
        default: { reducer: ui }
      } = require('../Report/BatchReport/state/uiSlice');
      const {
        default: { reducer: report }
      } = require('../Report/BatchReport/state/reportSlice');
      const {
        default: { reducer: app }
      } = require('./appSlice');
      const newReducer = combineReducers({ app, ui, report });
      // @ts-ignore
      store.replaceReducer(newReducer);
    },
  );
}

export default store;
