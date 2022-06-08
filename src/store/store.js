import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import {persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// import  thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';

import { rootSaga } from './root-saga';
import { rootReducer } from './root-reducer';

const sagaMiddleware = createSagaMiddleware();

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['cart'] //something about weird behavior so we're blocking it
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer ,
    middleware: [process.env.NODE_ENV === 'development' && logger, sagaMiddleware].filter(Boolean), //change to 'production' and it will get rid of all the state changes
});

sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store);




