import {
  GetServerSideProps,
  NextPage,
  InferGetServerSidePropsType,
} from "next/types";
import { PlusIcon, XMarkIcon } from "@heroicons/react/20/solid";
import useLocalStorage from "~/hooks/useLocalStorage";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface Recipe {
  name: string;
  image: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  ingredients: string[];
  instructions: string[];
  nutrition: {
    calories: number;
    fat: number;
    carbs: number;
    protein: number;
  };
}

type Props = {
  recipeId: string;
};

const DummyRecipe: Recipe = {
  name: "Fried Rice",
  image: "/fried_rice.jpg",
  prep_time: 5,
  cook_time: 10,
  servings: 4,
  ingredients: [
    "⅔ cup chopped baby carrots",
    "½ cup frozen green peas",
    "2 tablespoons vegetable oil",
    "1 clove garlic, minced, or to taste (Optional)",
    "2 large eggs",
    "3 cups leftover cooked white rice",
    "1 tablespoon soy sauce, or more to taste",
    "2 teaspoons sesame oil, or to taste",
  ],
  instructions: [
    "Assemble Ingredients.",
    "Place carrots in a small saucepan and cover with water. Bring to a low boil and cook for 3 to 5 minutes. Stir in peas, then immediately drain in a colander.",
    "Heat a wok over high heat. Pour in vegetable oil, then stir in carrots, peas, and garlic; cook for about 30 seconds. Add eggs; stir quickly to scramble eggs with vegetables.",
    "Stir in cooked rice. Add soy sauce and toss rice to coat. Drizzle with sesame oil and toss again.",
    "Serve immediately.",
  ],
  nutrition: {
    calories: 152,
    fat: 7,
    carbs: 19,
    protein: 4,
  },
};

const Recipe = ({
  recipeId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  // Magic code to make the checkboxes work with localStorage
  const [ingredients, setIngredients] = useState<
    (boolean | "disabled" | undefined)[]
  >([]);
  const [_ingredients, _setIngredients] = useLocalStorage<
    (boolean | "disabled" | undefined)[]
  >(`ingredient-state-${router.query.recipeId}`, []);

  useEffect(() => {
    setIngredients(_ingredients);
  }, []);

  useEffect(() => {
    _setIngredients(ingredients);
  }, [ingredients]);

  return (
    <>
      <div className="bg-slate-200 p-4 text-center text-gray-500">
        Navbar coming soon...
      </div>
      <main className="bg-neutral-50">
        <div className="mx-auto min-h-screen max-w-2xl bg-white shadow">
          <img
            src={DummyRecipe.image}
            alt={DummyRecipe.name}
            className="aspect-video w-full"
          />
          <div className="p-10">
            <h1 className="text-center text-3xl font-bold">
              {DummyRecipe.name}
            </h1>
            <div className="mt-4 flex flex-row justify-center space-x-8 text-neutral-700">
              <div className="flex flex-col items-center">
                <span className="text-sm text-neutral-500">Prep Time</span>
                <span>{DummyRecipe.prep_time} mins</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-sm text-neutral-500">Cook Time</span>
                <span>{DummyRecipe.cook_time} mins</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-sm text-neutral-500">Servings</span>
                <span>{DummyRecipe.servings}</span>
              </div>
            </div>
            <div className="mt-2 flex flex-col">
              <h2 className="text-lg font-bold text-neutral-700">
                Ingredients{" "}
                {!ingredients.every((i) => i == false) && (
                  <button
                    className={`text-xs font-normal text-neutral-500`}
                    onClick={() => {
                      setIngredients(DummyRecipe.ingredients.map(() => false));
                    }}
                  >
                    reset
                  </button>
                )}
              </h2>
              <ul className="mt-2 space-y-1 pl-4 text-neutral-900">
                {DummyRecipe.ingredients.map((ingredient, index) => {
                  return (
                    <li key={index} className="group flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 rounded border-neutral-700 hover:cursor-pointer disabled:border-gray-300 disabled:bg-gray-100"
                        disabled={ingredients[index] === "disabled"}
                        checked={ingredients[index] === true}
                        onChange={() => {
                          const newIngredients = [...ingredients];
                          newIngredients[index] = !newIngredients[index];
                          setIngredients(newIngredients);
                        }}
                      />
                      <span
                        className={`ml-2 ${
                          ingredients[index] === "disabled"
                            ? "text-neutral-400"
                            : "text-neutral-900"
                        }`}
                      >
                        {ingredient}
                      </span>
                      <button
                        className="ml-1"
                        onClick={() => {
                          const newIngredients = [...ingredients];
                          if (ingredients[index] === "disabled")
                            newIngredients[index] = false;
                          else {
                            newIngredients[index] = "disabled";
                          }
                          setIngredients(newIngredients);
                        }}
                      >
                        {ingredients[index] === "disabled" ? (
                          <PlusIcon className="invisible h-5 w-5 text-neutral-500 group-hover:visible" />
                        ) : (
                          <XMarkIcon className="invisible h-5 w-5 text-neutral-500 group-hover:visible" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="mt-4 flex flex-col">
              <h2 className="text-lg font-bold">Instructions</h2>
              <ol className="mt-2 list-decimal space-y-2 pl-10">
                {DummyRecipe.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </div>
            <div className="mt-4 flex flex-col">
              <h2 className="text-lg font-bold">Nutrition (per serving)</h2>
              <div className="mt-2 flex flex-row justify-center space-x-4">
                <div className="flex flex-col items-center">
                  <span className="text-sm text-neutral-600">Calories</span>
                  <span>{DummyRecipe.nutrition.calories}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-sm text-neutral-600">Fat</span>
                  <span>{DummyRecipe.nutrition.fat}g</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-sm text-neutral-600">Carbs</span>
                  <span>{DummyRecipe.nutrition.carbs}g</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-sm text-neutral-600">Protein</span>
                  <span>{DummyRecipe.nutrition.protein}g</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<{
  recipeId: string;
}> = async (context) => {
  const recipeId = context.query.recipeId as string;
  return {
    props: {
      recipeId,
    },
  };
};

export default Recipe;
