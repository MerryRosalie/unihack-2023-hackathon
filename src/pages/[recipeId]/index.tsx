import { GetServerSideProps, InferGetServerSidePropsType } from "next/types";
import { PlusIcon, XMarkIcon } from "@heroicons/react/20/solid";
import useLocalStorage from "~/hooks/useLocalStorage";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "~/components/Navbar";
import Timer from "~/components/Timer";
import React from "react";

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
  tags: string[];
}

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
  tags: ["Vegetarian", "Easy", "Healthy"],
};

type IngredientsState = (boolean | "disabled" | undefined)[];

const Recipe = ({
  recipeId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  // Magic code to make the checkboxes work with localStorage
  const [ingredients, setIngredients] = useState<IngredientsState>([]);
  const [_ingredients, _setIngredients] = useLocalStorage<IngredientsState>(
    `ingredients-state-${router.query.recipeId}`,
    []
  );

  useEffect(() => {
    setIngredients(_ingredients);
  }, []);

  useEffect(() => {
    _setIngredients(ingredients);
  }, [ingredients]);

  // Persistent extra ingredients
  const [extraIngredients, setExtraIngredients] = useState<string[]>([]);
  const [extraIngredientsState, setExtraIngredientsState] = useState<boolean[]>(
    []
  );
  const [newIngredient, setNewIngredient] = useState("");
  const [_extraIngredients, _setExtraIngredients] = useLocalStorage<string[]>(
    `extra-ingredients-${router.query.recipeId}`,
    []
  );
  const [_extraIngredientsState, _setExtraIngredientsState] = useLocalStorage<
    boolean[]
  >(`extra-ingredients-state-${router.query.recipeId}`, []);

  useEffect(() => {
    setExtraIngredients(_extraIngredients);
    setExtraIngredientsState(_extraIngredientsState);
  }, []);

  useEffect(() => {
    _setExtraIngredients(extraIngredients);
    _setExtraIngredientsState(extraIngredientsState);
  }, [extraIngredients, extraIngredientsState]);

  const [instructionState, setInstructionState] = useState<boolean[]>([]);

  useEffect(() => {
    setInstructionState(DummyRecipe.instructions.map(() => false));
  }, []);

  return (
    <>
      <Navbar />
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
            {/* Tags */}
            <h2 className="mx-auto mt-2 w-fit space-x-2 text-lg font-bold text-neutral-700">
              {DummyRecipe.tags.map((tag, index) => {
                return (
                  <span
                    key={`${index}-${tag}`}
                    className="inline-block rounded-full bg-neutral-200 px-3 py-1 text-sm font-medium text-neutral-900"
                  >
                    {tag}
                  </span>
                );
              })}
            </h2>
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
                {(!ingredients.every((i) => i === false || i === "disabled") ||
                  !extraIngredientsState.every((i) => i === false)) && (
                  <button
                    className={`text-xs font-normal text-neutral-500`}
                    onClick={() => {
                      setIngredients((ingredients) => [
                        ...ingredients.map((state) => {
                          if (state === "disabled") return "disabled";
                          return false;
                        }),
                      ]);
                      setExtraIngredientsState(
                        extraIngredients.map(() => false)
                      );
                    }}
                  >
                    reset
                  </button>
                )}
              </h2>
              <ul className="mt-2 space-y-1 pl-4 text-neutral-900">
                {DummyRecipe.ingredients.map((ingredient, index) => {
                  return (
                    <li
                      key={`ingredient-${index}`}
                      className="group flex items-center"
                    >
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

                {extraIngredients.map((ingredient, index) => {
                  return (
                    <li
                      key={`extra-ingredient-${index}`}
                      className="group flex items-center"
                    >
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 rounded border-neutral-700 hover:cursor-pointer disabled:border-gray-300 disabled:bg-gray-100"
                        checked={extraIngredientsState[index]}
                        onChange={() => {
                          const newIngredients = [...extraIngredientsState];
                          newIngredients[index] = !newIngredients[index];
                          setExtraIngredientsState(newIngredients);
                        }}
                      />
                      <span className="ml-2 text-neutral-900">
                        {ingredient}
                      </span>
                      <button
                        className="ml-1"
                        onClick={() => {
                          const newIngredients = [...extraIngredients];
                          newIngredients.splice(index, 1);
                          setExtraIngredients(newIngredients);
                        }}
                      >
                        <XMarkIcon className="invisible h-5 w-5 text-neutral-500 group-hover:visible" />
                      </button>
                    </li>
                  );
                })}
                <li className="group flex items-center">
                  <button
                    onClick={() => {
                      if (newIngredient === "") return;
                      setExtraIngredients((extraIngredients) => [
                        ...extraIngredients,
                        newIngredient,
                      ]);
                      setNewIngredient("");
                    }}
                  >
                    <PlusIcon className="h-4 w-4 scale-125 text-neutral-500" />
                  </button>
                  <input
                    type="text"
                    className="form-input ml-2 w-full border-transparent p-0 text-neutral-900 focus:border-transparent focus:outline-none focus:ring-0"
                    placeholder="Add an ingredient"
                    value={newIngredient}
                    onChange={(e) => {
                      setNewIngredient(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setExtraIngredients((extraIngredients) => [
                          ...extraIngredients,
                          newIngredient,
                        ]);
                        setNewIngredient("");
                      }
                    }}
                  />
                </li>
              </ul>
            </div>
            <div className="mt-4 flex flex-col">
              <h2 className="text-lg font-bold">
                Instructions{" "}
                {
                  <span className="text-xs font-normal text-gray-400">
                    Click to cross off
                  </span>
                }
              </h2>
              <ol className="mt-2 list-decimal space-y-2 pl-10">
                {DummyRecipe.instructions.map((instruction, index) => (
                  <React.Fragment key={index}>
                    <li key={index} className="pl-1">
                      <button
                        className={`text-left ${
                          instructionState[index]
                            ? "line-through"
                            : "no-underline"
                        }`}
                        onClick={() => {
                          const newInstructionState = [...instructionState];
                          newInstructionState[index] =
                            !newInstructionState[index];
                          setInstructionState(newInstructionState);
                        }}
                      >
                        {instruction}
                      </button>
                    </li>
                    {
                      // This is a hacky way to add a timer to the recipe
                      // I'm not sure how to do this in a better way
                      (() => {
                        // Add a timer if the string contains "minutes" or "seconds"
                        // Use regex to find the number
                        const minutes = instruction.match(/(\d+) minutes?/);
                        const seconds = instruction.match(/(\d+) seconds?/);
                        let total_seconds = 0;
                        if (minutes)
                          total_seconds += parseInt(minutes[1] || "") * 60;
                        if (seconds)
                          total_seconds += parseInt(seconds[1] || "");
                        return (
                          total_seconds > 0 && (
                            <Timer
                              seconds={total_seconds}
                              key={`timer-${index}`}
                            />
                          )
                        );
                      })()
                    }
                  </React.Fragment>
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
