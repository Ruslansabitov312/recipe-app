const meals = document.querySelector('.meals')

getRandomMeal()

async function getRandomMeal() {
  const resp = await fetch('https://www.themealdb.com/api/json/v1/1/random.php')
  const respData = await resp.json()
  const randomMeal = respData.meals[0]

  addMeal(randomMeal, true)
}

async function getMealBiId() {
  const meal = await fetch(
    'https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + id
  )
}

async function getMealsBySearch() {
  const meals = await fetch(
    'https://www.themealdb.com/api/json/v1/1/search.php?s=' + term
  )
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
      <button class="meal__add-to-fav-btn">Fav</button>
    </div>
  `

  meals.appendChild(meal)
}
