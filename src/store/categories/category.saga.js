import { takeLatest, all, call, put } from 'redux-saga/effects'

import { getCategoriesAndDocuments } from '../../utils/firebase/firebase.utils';

import { fetchCategoriesSuccess, fetchCategoriesFailed } from './category.action';

import { CATEGORIES_ACTION_TYPES } from './category.types';


export function* fetchCategoriesAsync() {
    try{
        const categoriesArray = yield call(getCategoriesAndDocuments,'categories') //give call a method in first argument, then give it its parameters
        yield put(fetchCategoriesSuccess(categoriesArray))
    } catch (error) {
        yield put(fetchCategoriesFailed(error))
    }
}

// This is where we respond to FETCH_CATEGORIES_START
export function* onFetchCategories() {
    yield takeLatest(CATEGORIES_ACTION_TYPES.FETCH_CATEGORIES_START, fetchCategoriesAsync) //recieve actions in take(), takeLatest() just means if there's a bunch of actions back to back, take the latest
}

//accumulator that holds all sagas related to category

export function* categoriesSaga() {
    yield all([call(onFetchCategories)]) //all is an effect that runs everything inside and completes when it's all done
}