const mealsEl = document.querySelector('.meals')
const favoriteContainer = document.querySelector('.fav-container__list')
const mealPopup = document.querySelector('.popup-container')
const popupCloseBtn = document.querySelector('.popup__close-btn')
const mealInfoEl = document.querySelector('.meal-info')
const searchTerm = document.querySelector('.header__input')
const searchBtn = document.querySelector('.header__search-btn')

getRandomMeal()
fetchFavMeals()

async function getRandomMeal() {
  const resp = await fetch('https://www.themealdb.com/api/json/v1/1/random.php')
  const respData = await resp.json()
  const randomMeal = respData.meals[0]

  addMeal(randomMeal, true)
}

async function getMealBiId(id) {
  const resp = await fetch(
    'https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + id
  )

  const respData = await resp.json()

  const meal = respData.meals[0]

  return meal
}

async function getMealsBySearch(term) {
  const resp = await fetch(
    'https://www.themealdb.com/api/json/v1/1/search.php?s=' + term
  )

  const respData = await resp.json()
  const meals = respData.meals

  return meals
}

function addMeal(mealData, random = false) {
  const meal = document.createElement('div')
  meal.classList.add('meal')

  meal.innerHTML = `
    <div class="meal__header">
      ${random ? `<span class="meal__title-random">Random Recipe</span>` : ''}
      <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
    </div>

    <div class="meal__content">
      <h4 class="meal__title">${mealData.strMeal}</h4>
      <button class="meal__add-to-fav-btn">save</button>
    </div>
  `
  const btn = meal.querySelector('.meal__content .meal__add-to-fav-btn')
  btn.addEventListener('click', () => {
    if (btn.classList.contains('active')) {
      removeMealLS(mealData.idMeal)
      btn.classList.remove('active')
      btn.innerText = 'save'
    } else {
      addMealLS(mealData.idMeal)
      btn.classList.add('active')
      btn.innerText = 'saved'
    }

    fetchFavMeals()
  })

  meal.addEventListener('click', () => {
    showMealInfo(mealData)
  })

  mealsEl.appendChild(meal)
}

function addMealLS(mealId) {
  const mealIds = getMealsLS()

  localStorage.setItem('mealIds', JSON.stringify([...mealIds, mealId]))
}

function removeMealLS(mealId) {
  const mealIds = getMealsLS()

  localStorage.setItem(
    'mealIds',
    JSON.stringify(mealIds.filter((id) => id !== mealId))
  )
}

function getMealsLS() {
  const mealIds = JSON.parse(localStorage.getItem('mealIds'))

  return mealIds === null ? [] : mealIds
}

async function fetchFavMeals() {
  // очистить контейнер
  favoriteContainer.innerHTML = ''

  const mealIds = getMealsLS()

  for (let i = 0; i < mealIds.length; i++) {
    const mealId = mealIds[i]
    const meal = await getMealBiId(mealId)

    addMealFav(meal)
  }
}

function addMealFav(mealData) {
  const favMeal = document.createElement('li')
  favMeal.classList.add('fav-container__list-item')

  favMeal.innerHTML = `
    <img 
      src="${mealData.strMealThumb}" 
      alt="${mealData.strMeal}"
    >
    <span>${mealData.strMeal}</span>
    <button class="fav-container__delete-btn">&#10006</button>
  `

  const btn = favMeal.querySelector('.fav-container__delete-btn')
  btn.addEventListener('click', () => {
    removeMealLS(mealData.idMeal)

    fetchFavMeals()
  })

  favMeal.addEventListener('click', () => {
    showMealInfo(mealData)
  })

  favoriteContainer.appendChild(favMeal)
}

function showMealInfo(mealData) {
  // очистить всп. окно
  mealInfoEl.innerHTML = ''

  // обновить ифнормацию о блюде
  const mealEl = document.createElement('div')

  const ingredients = []
  // получить ингредиенты и меры
  for (let i = 1; i < 20; i++) {
    if (mealData['strIngredient' + i]) {
      ingredients.push(
        `${mealData['strIngredient' + i]} - ${mealData['strMeasure' + i]}`
      )
    } else {
      break
    }
  }

  mealEl.innerHTML = `
    <h1 class="meal-info__title">${mealData.strMeal}</h1>
    <img
      src="${mealData.strMealThumb}" 
      alt="${mealData.strMealThumb}" 
      class="meal-info__img"
    >
    <p class="meal-info__text">${mealData.strInstructions}</p>
    <h3>Ingredients:</h3>
    <ul class="meal-info__list">
      ${ingredients
        .map(
          (ing) => `
        <li class="meal-info__list-item">${ing}</li>
      `
        )
        .join('')}
    </ul>
  `

  mealInfoEl.appendChild(mealEl)

  //показать всплывающее окно
  mealPopup.classList.remove('hidden')
}

searchBtn.addEventListener('click', async () => {
  // очистить контейнер
  mealsEl.innerHTML = ''
  const search = searchTerm.value

  const meals = await getMealsBySearch(search)

  if (meals) {
    meals.forEach((meal) => {
      addMeal(meal)
    })
  }
})

popupCloseBtn.addEventListener('click', () => {
  mealPopup.classList.add('hidden')
})
