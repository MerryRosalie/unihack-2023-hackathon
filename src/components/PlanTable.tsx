import { Console } from "console";
import { BLOCKED_PAGES } from "next/dist/shared/lib/constants";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";

interface ItemInterface {
  id: number,
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


  useEffect(() => {
    const fetchMealPlan = async () => {
      // checking if the meal plan already exists
      console.log(regenerate);
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
      if (!Object.is(storedMealPlan, blankPlan) && storedMealPlan) {
        setState(JSON.parse(storedMealPlan));
      } else {
        // Api call to get a weekly meal plan based on calories and diet specified by the user
        let calories = 2000;
        let diet = "vegetarian";
        let plan: any = await fetch('https://api.spoonacular.com/mealplanner/generate?apiKey=aae67d05b464460e9bd6d10b74fb0940&timeFrame=week&targetCalories=' + calories + '&diet=' + diet, {
          method: 'GET',
          redirect: 'follow'
        });
        plan = await plan.json();
        let newItems = [] as ItemArrayInterface;
        let newColumns = {} as ColumnInterface;

        Object.keys(plan.week).forEach((day) => {
          let meals = [] as meals;
          // @ts-ignore
          plan.week[day].meals.forEach((meal) => {
            meals.push(meal);

            newItems.push({
              id: meal.id,
              title: meal.title,
            });
          });

          newColumns.UNPLANNED = [];
          newColumns[day.toUpperCase()] = meals.map((meal) => meal.id);
        });
        let newState = { items: newItems, columns: newColumns };
        setState(newState);
        // Saving the meal plan to local storage so that the user can access it when they come back to this page
        localStorage.setItem("mealPlan", JSON.stringify(newState));
      }
    }
    fetchMealPlan();
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
      <div className="flex justify-center">
        <button onClick={() => setRegenerate(!regenerate)} className="py-2 px-4 bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
          Regenerate plan!
        </button>
      </div>
    </>
  );
};

export default PlanTable;
