import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from "next/types";
import { PlusIcon, XMarkIcon } from "@heroicons/react/20/solid";
import useLocalStorage from "~/hooks/useLocalStorage";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "~/components/Navbar";
import Timer from "~/components/Timer";
import React from "react";
import { Recipe, RecipeSchema } from "~/types/Recipe";
import recipes from "~/recipes.json";
import Head from "next/head";
import axios from "axios";

type IngredientsState = (boolean | "disabled" | undefined)[];

const Recipe = ({
  recipeObj,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
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
    setInstructionState(recipeObj.instructions.map(() => false));
  }, []);

  return (
    <>
      <Head>
        <title>{recipeObj.name}</title>
        <meta property="og:title" content={recipeObj.name} />
        <meta property="og:image" content={recipeObj.image} />
      </Head>
      <Navbar />
      <main className="bg-neutral-50">
        <div className="mx-auto min-h-screen max-w-2xl bg-white shadow">
          <img
            src={recipeObj.image}
            alt={recipeObj.name}
            className="aspect-video w-full object-cover"
          />
          <div className="p-10">
            <h1 className="text-center text-3xl font-bold">{recipeObj.name}</h1>
            {/* Tags */}
            <h2 className="mx-auto mt-2 w-fit space-x-2 text-lg font-bold text-neutral-700">
              {recipeObj.tags &&
                recipeObj.tags.map((tag, index) => {
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
                <span>{recipeObj.prep_time} mins</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-sm text-neutral-500">Cook Time</span>
                <span>{recipeObj.cook_time} mins</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-sm text-neutral-500">Servings</span>
                <span>{recipeObj.servings}</span>
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
                {recipeObj.ingredients.map((ingredient, index) => {
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
            <div className="group mt-4 flex flex-col">
              <h2 className="text-lg font-bold">
                Instructions{" "}
                {
                  <span className="invisible text-xs font-normal text-gray-400 group-hover:visible">
                    Click to cross off
                  </span>
                }
              </h2>
              <ol className="mt-2 list-decimal space-y-2 pl-10">
                {recipeObj.instructions.map((instruction, index) => (
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
                          total_seconds > 0 &&
                          !instructionState[index] && (
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
                  <span>{recipeObj.nutrition.calories}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-sm text-neutral-600">Fat</span>
                  <span>{recipeObj.nutrition.fat}g</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-sm text-neutral-600">Carbs</span>
                  <span>{recipeObj.nutrition.carbs}g</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-sm text-neutral-600">Protein</span>
                  <span>{recipeObj.nutrition.protein}g</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: recipes.map((recipe) => ({
      params: {
        recipeId: recipe.id,
      },
    })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<{
  recipeObj: Recipe;
}> = async (context) => {
  const recipeId = context.params?.recipeId as string;

  // Get corresponding recipe from recipes json file
  let recipeObj = recipes.find((recipe) => recipe.id === recipeId);

  if (!recipeObj) {
    const res = await axios.get(
      `https://api.spoonacular.com/recipes/${recipeId}/analyzedInstructions?stepBreakdown=false&apiKey=${process.env.NEXT_PUBLIC_IMAGE_RECOGNITION_API_KEY}`
    );
    const instructions = res.data[0].steps.map((step: any) => step.step);
    const res2 = await axios.get(
      `https://api.spoonacular.com/recipes/${recipeId}/information?includeNutrition=true&apiKey=${process.env.NEXT_PUBLIC_IMAGE_RECOGNITION_API_KEY}`
    );
    const recipe = res2.data;

    console.log(recipe.nutrition.nutrients);

    const word_to_number: Record<string, number> = {
      zero: 0,
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5,
      six: 6,
      seven: 7,
      eight: 8,
      nine: 9,
      ten: 10,
    };

    instructions.forEach((instruction: string, index: number) => {
      const words = instruction.split(" ");
      words.forEach((word, index) => {
        if (word in word_to_number) {
          words[index] = word_to_number[word]?.toString() as string;
        }
      });
      instructions[index] = words.join(" ");
    });

    recipeObj = RecipeSchema.parse({
      id: recipeId,
      name: recipe.title,
      image: recipe.image,
      prep_time: 0,
      cook_time: recipe.readyInMinutes,
      servings: recipe.servings,
      ingredients: recipe.extendedIngredients.map(
        (ingredient: any) => ingredient.original
      ),
      instructions,
      nutrition: {
        calories: recipe.nutrition.nutrients[0].amount,
        fat: recipe.nutrition.nutrients[1].amount,
        carbs: recipe.nutrition.nutrients[3].amount,
        protein: recipe.nutrition.nutrients[8].amount,
      },
      tags: [],
    });
  }

  return {
    props: {
      recipeObj,
    },
    revalidate: 86400,
  };
};

export default Recipe;
