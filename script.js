const mainContainer = document.getElementById("mainContainer");
const spinner = document.getElementById("spinner");
const search = document.getElementById("search");
const searchByName = document.querySelector("#search input:first-child");
const searchByFirstLetter = document.querySelector("#search input:nth-child(2)");

function toggleSidebar() {
  $("aside .left").animate({ width: "toggle" });
  $("aside .right button i").toggleClass("fa-xmark");
  $("aside").toggleClass("open");
}

function toggleSpinner() {
  document.getElementById("spinner").classList.toggle("d-none");
}

$("aside .right button").on("click", () => {
  toggleSidebar();
});

searchByName.addEventListener("input", (e) => {
  fetchData("searchByName", e.target.value);
});

searchByFirstLetter.addEventListener("input", (e) => {
  fetchData("searchByFirstLetter", e.target.value);
});

const validationStatus = {
  name: false,
  email: false,
  phone: false,
  age: false,
  password: false,
  passwordConfirmation: false,
  validateAll() {
    return this.name && this.email && this.phone && this.age && this.password && this.passwordConfirmation;
  },
};

function areAllValid() {
  const btn = document.querySelector("#contact button");
  if (validationStatus.validateAll()) {
    btn.classList.remove("btn-outline-danger");
    btn.classList.add("btn-outline-success");
    btn.removeAttribute("disabled");
  } else {
    btn.classList.remove("btn-outline-success");
    btn.classList.add("btn-outline-danger");
    btn.setAttribute("disabled", "");
  }
}

function validationHandler(e) {
  switch (e.target.getAttribute("name")) {
    case "name":
      if (/^[a-zA-Z\s]{3,40}$/g.test(e.target.value)) {
        e.target.classList.remove("is-invalid");
        e.target.classList.add("is-valid");
        validationStatus.name = true;
      } else {
        e.target.classList.remove("is-valid");
        e.target.classList.add("is-invalid");
        validationStatus.name = false;
      }
      break;
    case "email":
      if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(e.target.value)) {
        e.target.classList.remove("is-invalid");
        e.target.classList.add("is-valid");
        validationStatus.email = true;
      } else {
        e.target.classList.remove("is-valid");
        e.target.classList.add("is-invalid");
        validationStatus.email = false;
      }
      break;
    case "phone":
      if (/^\+?[0-9]{8,20}$/g.test(e.target.value)) {
        e.target.classList.remove("is-invalid");
        e.target.classList.add("is-valid");
        validationStatus.phone = true;
      } else {
        e.target.classList.remove("is-valid");
        e.target.classList.add("is-invalid");
        validationStatus.phone = false;
      }
      break;
    case "age":
      if (/^(1[2-9]|[2-8][0-9]|90)$/g.test(e.target.value)) {
        e.target.classList.remove("is-invalid");
        e.target.classList.add("is-valid");
        validationStatus.age = true;
      } else {
        e.target.classList.remove("is-valid");
        e.target.classList.add("is-invalid");
        validationStatus.age = false;
      }
      break;
    case "password":
      if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$#\^!%*?&]{8,}$/g.test(e.target.value)) {
        e.target.classList.remove("is-invalid");
        e.target.classList.add("is-valid");
        validationStatus.password = true;
      } else {
        e.target.classList.remove("is-valid");
        e.target.classList.add("is-invalid");
        validationStatus.password = false;
      }
      if (e.target.value !== document.querySelector('#contact input[name="passwordConfirmation"]').value) {
        document.querySelector('#contact input[name="passwordConfirmation"]').classList.remove("is-valid");
        document.querySelector('#contact input[name="passwordConfirmation"]').classList.add("is-invalid");
        validationStatus.passwordConfirmation = false;
      } else {
        document.querySelector('#contact input[name="passwordConfirmation"]').classList.remove("is-invalid");
        document.querySelector('#contact input[name="passwordConfirmation"]').classList.add("is-valid");
        validationStatus.passwordConfirmation = true;
      }
      break;
    case "passwordConfirmation":
      if (e.target.value === document.querySelector('#contact input[name="password"]').value) {
        e.target.classList.remove("is-invalid");
        e.target.classList.add("is-valid");
        validationStatus.passwordConfirmation = true;
      } else {
        e.target.classList.remove("is-valid");
        e.target.classList.add("is-invalid");
        validationStatus.passwordConfirmation = false;
      }
      break;
    default:
      console.error("No type provided.");
  }
  areAllValid();
}

function addValidationListeners() {
  document.querySelector("#contact input[name='name']").addEventListener("input", validationHandler);
  document.querySelector("#contact input[name='email']").addEventListener("input", validationHandler);
  document.querySelector("#contact input[name='phone']").addEventListener("input", validationHandler);
  document.querySelector("#contact input[name='age']").addEventListener("input", validationHandler);
  document.querySelector("#contact input[name='password']").addEventListener("input", validationHandler);
  document.querySelector("#contact input[name='passwordConfirmation']").addEventListener("input", validationHandler);
}

async function fetchData(type, value) {
  try {
    toggleSpinner();
    switch (type) {
      case "home":
        const homeRes = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=");
        if (!homeRes.ok) throw new Error("Failed to fetch the meals :(");
        const homeData = await homeRes.json();
        displayData("meals", homeData.meals.slice(0, 20));
        break;
      case "categories":
        const categoryRes = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
        if (!categoryRes.ok) throw new Error("Failed to fetch the categories :(");
        const categoryData = await categoryRes.json();
        displayData("categories", categoryData.categories);
        break;
      case "categoryMeals":
        const categoryMealsRes = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${value}`);
        if (!categoryMealsRes.ok) throw new Error("Failed to fetch the meals :(");
        const categoryMealsData = await categoryMealsRes.json();
        displayData("categoryMeals", categoryMealsData.meals.slice(0, 20));
        break;
      case "areas":
        const areaRes = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list");
        if (!areaRes.ok) throw new Error("Failed to fetch the areas :(");
        const areaData = await areaRes.json();
        displayData("areas", areaData.meals);
        break;
      case "areaMeals":
        const areaMealsRes = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${value}`);
        if (!areaMealsRes.ok) throw new Error("Failed to fetch the meals :(");
        const areaMealsData = await areaMealsRes.json();
        displayData("areaMeals", areaMealsData.meals.slice(0, 20));
        break;
      case "ingredients":
        const ingredientsRes = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list");
        if (!ingredientsRes.ok) throw new Error("Failed to fetch the ingredients :(");
        const ingredientsData = await ingredientsRes.json();
        displayData("ingredients", ingredientsData.meals.slice(0, 25));
        break;
      case "ingredientMeals":
        const ingredientRes = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${value}`);
        if (!ingredientRes.ok) throw new Error("Failed to fetch the meals :(");
        const ingredientData = await ingredientRes.json();
        displayData("ingredientMeals", ingredientData.meals.slice(0, 20));
        break;
      case "searchByName":
        mainContainer.innerHTML = "";
        const searchByNameRes = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${value}`);
        if (!searchByNameRes.ok) throw new Error("Failed to fetch the meals :(");
        const searchByNameData = await searchByNameRes.json();
        if (!searchByNameData.meals) return;
        displayData("searchByName", searchByNameData.meals.slice(0, 20));
        break;
      case "searchByFirstLetter":
        if (!value) return;
        mainContainer.innerHTML = "";
        const searchByFirstLetterRes = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${value}`);
        if (!searchByFirstLetterRes.ok) throw new Error("Failed to fetch the meals :(");
        const searchByFirstLetterData = await searchByFirstLetterRes.json();
        if (!searchByFirstLetterData.meals) return;
        displayData("searchByFirstLetter", searchByFirstLetterData.meals.slice(0, 20));
        break;
      case "meal":
        mainContainer.innerHTML = "";
        const mealRes = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${value}`);
        if (!mealRes.ok) throw new Error("Failed to fetch the meal :(");
        const mealData = await mealRes.json();
        displayData("meal", mealData.meals[0]);
        break;
      default:
        console.error("No type provided");
    }
  } catch (err) {
    console.error(err.message);
  } finally {
    toggleSpinner();
  }
}

function displayData(type, data) {
  let container = "";
  switch (type) {
    case "meals":
    case "categoryMeals":
    case "areaMeals":
    case "ingredientMeals":
    case "searchByName":
    case "searchByFirstLetter":
      data.forEach((element) => {
        container += `
        <div class="col">
          <div class="meal rounded-3 overflow-hidden" onclick="fetchData('meal', ${element.idMeal});">
            <img src="${element.strMealThumb}" alt="${element.strMeal}" class="img-fluid d-block" />
            <h3>${element.strMeal}</h3>
          </div>
        </div>
        `;
      });
      mainContainer.classList = "row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 mt-4";
      break;
    case "categories":
      data.forEach((el) => {
        container += `
        <div class="col">
          <div class="category rounded-3 overflow-hidden" onclick="fetchData('categoryMeals', '${el.strCategory}')">
            <img src="${el.strCategoryThumb}" alt="${el.strCategory}" class="img-fluid d-block" />
            <div>
              <h3>${el.strCategory}</h3>
              <p>${
                el.strCategoryDescription.length > 100
                  ? `${el.strCategoryDescription.slice(0, 100)}...`
                  : el.strCategoryDescription
              }</p>
            </div>
          </div>
        </div>
        `;
      });
      mainContainer.classList = "row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 mt-4";
      break;
    case "areas":
      data.forEach((el) => {
        container += `
        <div class="col">
          <div class="area d-flex flex-column align-items-center gap-2" onclick="fetchData('areaMeals', '${el.strArea}')">
          <i class="fa-solid fa-flag fs-1"></i>
            <h3>${el.strArea}</h3>
          </div>
        </div>
        `;
      });
      mainContainer.classList = "row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 mt-4";
      break;
    case "ingredients":
      data.forEach((el) => {
        container += `
        <div class="col">
          <div class="ingredient d-flex flex-column align-items-center gap-2" onclick="fetchData('ingredientMeals', '${
            el.strIngredient
          }')">
            <i class="fa-brands fa-pagelines"></i>
            <div>
              <h3>${el.strIngredient}</h3>
              <p>${el.strDescription.length > 100 ? `${el.strDescription.slice(0, 100)}...` : el.strDescription}</p>
            </div>
          </div>
        </div>
        `;
      });
      mainContainer.classList = "row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 mt-4";
      break;
    case "meal":
      let tags = "";
      data.strTags
        ? data.strTags.split(",").forEach((el) => (tags += `<li class="alert alert-secondary px-2 py-1">${el}</li>`))
        : (tags = "<li class='fst-italic'>No tags</li>");
      container = `
      <div class="img col-12 col-lg-4">
        <img src="${data.strMealThumb}" alt="${data.strMeal}" class="img-fluid rounded rounded-3" />
        <h2 class="text-center mt-3">${data.strMeal}</h2>
      </div>
      <div class="col-12 col-lg-8">
        <h2>Instructions</h2>
        <p>${data.strInstructions}</p>
        <h4 class="fw-normal mb-3"><span class="fw-semibold">Area: </span>${data.strArea}</h4>
        <h4 class="fw-normal mb-3"><span class="fw-semibold">Category: </span>${data.strCategory}</h4>
        <div class="meal-ingredients">
          <h4 class="fw-normal"><span class="fw-semibold">Ingredients: </span></h4>
          <ul class="d-flex flex-wrap gap-2 gap-lg-2 mb-3">
          ${Object.keys(data).reduce((acc, curr, i) => {
            if (data[`strIngredient${i + 1}`]) {
              acc += `<li class="alert alert-warning px-2 py-1 mb-0">${data[`strMeasure${i + 1}`]} ${
                data[`strIngredient${i + 1}`]
              }</li>`;
            }
            return acc;
          }, "")}
          </ul>
        </div>
        <div class="meal-tags mb-4">
          <h4 class="fw-normal"><span class="fw-semibold">Tags: </span></h4>
          <ul class="d-flex flex-wrap gap-2 gap-lg-2">${tags}</ul>
        </div>
        <ul class="meal-links d-flex flex-wrap gap-2">
          ${data.strSource ? `<li><a href="${data.strSource}" class="btn btn-success">Source</a></li>` : ""}
          <li><a href="${data.strYoutube}" class="btn btn-danger">Youtube</a></li>
        </ul>
      </div>
      `;
      mainContainer.classList = "row";
      break;
    case "contact":
      container += `
      <form class="d-flex flex-column" id="contact">
      <div class="row row-cols-1 row-cols-md-2 g-4 mb-4">
        <div class="form-group">
          <input
            class="form-control"
            name="name"
            type="text"
            aria-label="Name"
            placeholder="Enter your name"
            minlength="3"
            maxlength="40"
          />
          <p class="invalid-feedback">
            Your name must only contain letters with a minimum length of 3, and a max of 40
          </p>
        </div>
        <div class="form-group">
          <input
            class="form-control"
            name="email"
            type="email"
            aria-label="Email"
            placeholder="Enter your email"
          />
          <p class="invalid-feedback">Your email is invalid, it must follow this syntax: user@example.com</p>
        </div>
        <div class="form-group">
          <input
            class="form-control"
            name="phone"
            type="number"
            aria-label="Phone"
            placeholder="Enter your phone"
          />
          <p class="invalid-feedback">
            Invalid phone number, make sure it has a minimum length of 8 and a max of 20
          </p>
        </div>
        <div class="form-group">
          <input class="form-control" name="age" type="number" aria-label="Age" placeholder="Enter your age" />
          <p class="invalid-feedback">Your age must be between 12 and 90 years old</p>
        </div>
        <div class="form-group">
          <input
            class="form-control"
            name="password"
            type="password"
            aria-label="Password"
            placeholder="Enter your password"
          />
          <p class="invalid-feedback">
            Your password must contain at least 1 uppercase letter, 1 lowercase letter and 1 number
          </p>
        </div>
        <div class="form-group">
          <input
            class="form-control"
            name="passwordConfirmation"
            type="password"
            aria-label="Password confirmation"
            placeholder="Confirm your password"
          />
          <p class="invalid-feedback">Password doesn't match</p>
        </div>
      </div>
      <button class="btn btn-outline-danger px-4 mx-auto" disabled>Submit</button>
    </form>
      `;
      mainContainer.classList = "";
      break;
    default:
      console.error("No type provided.");
  }
  mainContainer.innerHTML = container;
}

function navigate(to) {
  switch (to) {
    case "home":
      search.classList.add("d-none");
      mainContainer.innerHTML = "";
      fetchData("home");
      break;
    case "search":
      search.classList.remove("d-none");
      mainContainer.innerHTML = "";
      break;
    case "categories":
      search.classList.add("d-none");
      mainContainer.innerHTML = "";
      fetchData("categories");
      break;
    case "areas":
      search.classList.add("d-none");
      mainContainer.innerHTML = "";
      fetchData("areas");
      break;
    case "ingredients":
      search.classList.add("d-none");
      mainContainer.innerHTML = "";
      fetchData("ingredients");
      break;
    case "contact":
      search.classList.add("d-none");
      displayData("contact");
      addValidationListeners();
      break;
    default:
      console.error("Please provide a page to navigate to.");
  }
  toggleSidebar();
}

fetchData("home");
