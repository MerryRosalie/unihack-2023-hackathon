import dynamic from "next/dynamic";
import React, { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";

interface ItemInterface {
  id: number,
  content: string
}

type ItemArrayInterface = ItemInterface[];

interface ColumnInterface {
  RECOMMENDED: Number[];
  MONDAY: Number[];
  TUESDAY: Number[];
  WEDNESDAY: Number[];
  THURSDAY: Number[];
  FRIDAY: Number[];
  SATURDAY: Number[];
  SUNDAY: Number[];
  [key: string]: any;
}

interface StateInterface {
  items: ItemArrayInterface,
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
    items: [
      { id: 0, content: "Fried Rice" },
      { id: 1, content: "Fried Rice" },
      { id: 2, content: "Fried Rice" },
      { id: 3, content: "Fried Rice" },
      { id: 4, content: "Fried Rice" },
    ],
    columns: {
      RECOMMENDED: [0, 1, 2, 3, 4],
      MONDAY: [],
      TUESDAY: [],
      WEDNESDAY: [],
      THURSDAY: [],
      FRIDAY: [],
      SATURDAY: [],
      SUNDAY: [],
    },
  });

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
  );
};

export default PlanTable;
