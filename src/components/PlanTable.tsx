import { Console, count } from "console";
import { BLOCKED_PAGES } from "next/dist/shared/lib/constants";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { Dialog } from "@headlessui/react";
import { number } from "zod";

interface ItemInterface {
  id: number,
  actual_id: number,
  title: string
}

type ItemArrayInterface = ItemInterface[];

interface ColumnInterface {
  UNPLANNED: Number[];
  MONDAY: Number[];
  TUESDAY: Number[];
  WEDNESDAY: Number[];
  THURSDAY: Number[];
  FRIDAY: Number[];
  SATURDAY: Number[];
  SUNDAY: Number[];
  [key: string]: any;
}

interface meal {
  id: number,
  imageType: string,
  title: string,
  readyInMinutes: number,
  servings: number,
}

type meals = meal[];

interface weeklyMeals {
  monday: meals,
  tuesday: meals,
  wednesday: meals,
  thursday: meals,
  friday: meals,
  saturday: meals,
  sunday: meals,
}

interface StateInterface {
  items: ItemArrayInterface | meals,
  columns: ColumnInterface
}

const Column = dynamic(() => import("../components/Column"), { ssr: false });

const reorderColumnList = (
  itemsArray: Number[],
  startIndex: number,
  endIndex: number
) => {
  const newItems = Array.from(itemsArray);
  const [removed] = newItems.splice(startIndex, 1);
  newItems.splice(endIndex, 0, removed as Number);

  return newItems;
};

const PlanTable = () => {
  const [calories, setCalories] = useState<number>(2500);
  const [diet, setDiet] = useState<string>('vegetarian');

  const [state, setState] = useState<StateInterface>({
    items: [],
    columns: {
      UNPLANNED: [],
      MONDAY: [],
      TUESDAY: [],
      WEDNESDAY: [],
      THURSDAY: [],
      FRIDAY: [],
      SATURDAY: [],
      SUNDAY: [],
    },
  });

  const [regenerate, setRegenerate] = useState(true);
  const [submitted, setSubmitted] = useState(false);


  useEffect(() => {
    const fetchMealPlan = async (calories: number, diet: string) => {
      // checking if the meal plan already exists
      const storedMealPlan = localStorage.getItem("mealPlan");
      let blankPlan = {
        items: [],
        columns: {
          UNPLANNED: [],
          MONDAY: [],
          TUESDAY: [],
          WEDNESDAY: [],
          THURSDAY: [],
          FRIDAY: [],
          SATURDAY: [],
          SUNDAY: [],
        },
      }
      console.log(storedMealPlan);
      console.log(Object.is(storedMealPlan, blankPlan));
      if (!Object.is(storedMealPlan, blankPlan) && storedMealPlan && submitted) {
        setState(JSON.parse(storedMealPlan));
      } else {
        // Api call to get a weekly meal plan based on calories and diet specified by the user
        console.log(calories, diet);
        // Api call to get a weekly meal plan based on calories and diet specified by the user
        let plan: any = await fetch('https://api.spoonacular.com/mealplanner/generate?apiKey=89df64aea10245a2a1e2d10887ea7c3d&timeFrame=week&targetCalories=' + calories + '&diet=' + diet, {
          method: 'GET',
          redirect: 'follow'
        });
        plan = await plan.json();
        console.log(plan);

        let newItems = [] as ItemArrayInterface;
        let newColumns = {} as ColumnInterface;

        let counter = 1;
        Object.keys(plan.week).forEach((day) => {
          let meals = [] as meals;
          // @ts-ignore
          plan.week[day].meals.forEach((meal) => {
            meal.id = counter;
            meals.push(meal);
            newItems.push({
              id: counter,
              actual_id: meal.id,
              title: meal.title,
            });
            counter++;
          });


          newColumns.UNPLANNED = [];
          newColumns[day.toUpperCase()] = meals.map((meal) => meal.id);
        });
        let newState = { items: newItems, columns: newColumns };
        setState(newState);
        setSubmitted(() => !submitted);
        // Saving the meal plan to local storage so that the user can access it when they come back to this page
        localStorage.setItem("mealPlan", JSON.stringify(newState));
      }
    }
    fetchMealPlan(calories, diet);
  }, [regenerate])

  const onDragEnd = (result: any) => {
    const { destination, source } = result;

    // If user tries to drop in an unknown destination
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceArray = state.columns[source.droppableId] as Number[];
    const destArray = state.columns[destination.droppableId] as Number[];

    if (source.droppableId === destination.droppableId) {
      const newItems = reorderColumnList(
        sourceArray,
        source.index,
        destination.index
      );

      const newState = {
        ...state,
        columns: {
          ...state.columns,
          [source.droppableId]: newItems,
        },
      };
      setState(newState);
      return;
    }

    // If the user moves from one column to another
    const newSourceArray = Array.from(sourceArray);
    const [removed] = newSourceArray.splice(source.index, 1);

    const newEndArray = Array.from(destArray);
    newEndArray.splice(destination.index, 0, removed as Number);

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [source.droppableId]: newSourceArray,
        [destination.droppableId]: newEndArray,
      },
    };

    setState(newState);
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-center">
        <div className="w-full max-w-md">
          <form>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Target Daily Calories
              </label>
              <input
                type="number"
                name="calories"
                value={calories}
                onChange={(e) =>
                  setCalories(parseInt(e.target.value))
                }
                min="1"
                max="10000"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Dietary Restrictions
              </label>
              <select
                className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                value={diet}
                onChange={(e) => setDiet(e.target.value)}
              >
                <option value="whole30">Whole30</option>
                <option value="paleo">Paleo</option>
                <option value="ketogenic">Ketogenic</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="gluten-free">Gluten Free</option>
              </select>
            </div>
            <div className="flex items-center justify-center">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setRegenerate(!regenerate);
                  localStorage.setItem("mealPlan", "");
                }}
                className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Regenerate Meal Plan
              </button>
            </div>
          </form>
        </div>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="m-auto flex p-4">
          {Object.keys(state.columns).map((column) => {
            const items = state.columns[column].map((itemId: number) =>
              state.items.find((item) => item.id === itemId)
            );
            return <Column key={column} column={column} items={items} />;
          })}
        </div>
      </DragDropContext>
    </>
  );
};

export default PlanTable;