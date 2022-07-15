const mealsEl = document.querySelector('.meals')
const favoriteContainer = document.querySelector('.fav-container__list')

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
  console.log(mealData)

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
    <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
    <span>${mealData.strMeal}</span>
    <button class="fav-container__delete-btn">&#10006</button>
  `

  const btn = favMeal.querySelector('.fav-container__delete-btn')
  btn.addEventListener('click', () => {
    removeMealLS(mealData.idMeal)

    fetchFavMeals()
  })

  favoriteContainer.appendChild(favMeal)
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
