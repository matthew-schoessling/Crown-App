import {createSelector } from 'reselect'

const selectCategoryReducer = (state) => state.categories;

export const selectCategories = createSelector(
    [selectCategoryReducer],
    (categoriesSlice) => categoriesSlice.categories
)

// For reference, acc is the accumulator and this is accumulating an array of all the different categories (hats, jackets, etc)
export const selectCategoriesMap = createSelector(
    [selectCategories],
    (categories) => 
    categories.reduce((acc, category) => {
        console.log(acc, category)
       const { title, items } = category
       acc[title.toLowerCase()] = items;
       return acc;
   }, {})
)

export const selectCategoriesIsLoading = createSelector(
    [selectCategoryReducer],
    (categoriesSlice) => categoriesSlice.isLoading
)