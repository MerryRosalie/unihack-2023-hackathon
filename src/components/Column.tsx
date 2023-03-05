import { Draggable, Droppable } from "react-beautiful-dnd";
const Column = ({ column, items }: any) => {
  return (
    <div className="h-[620px] w-[400px] flex-col">
      <div className="mb-1.5 flex h-[65px] items-center justify-center px-1.5 text-emerald-600 hover:text-emerald-400">
        <h2 className="text-sm font-medium">{column}</h2>
      </div>

      <Droppable droppableId={column}>
        {(droppableProvided, droppableSnapshot) => (
          <div
            className="flex flex-1 flex-col px-1.5"
            ref={droppableProvided.innerRef}
            {...droppableProvided.droppableProps}
          >
            {items.map((item: any, index: number) => (
              <Draggable key={item.id} draggableId={`${item.id}`} index={index}>
                {(draggableProvided: any, draggableSnapshot) => (
                  <a
                    // NEED TO ADD LINK HERE TO THE CORRESPONDING RECIPE...
                    href={`/recipes/${item.id}`}
                    className="mb-2 flex justify-between bg-emerald-100 text-white shadow-md"
                    ref={draggableProvided.innerRef}
                    {...draggableProvided.draggableProps}
                    {...draggableProvided.dragHandleProps}
                  >
                    <h3 className="m-2 text-sm font-semibold text-emerald-700 line-clamp-3">
                      {item.title}
                    </h3>
                    <img
                      className="relative my-auto aspect-video h-20 max-w-max object-cover"
                      src={
                        "https://spoonacular.com/recipeImages/" +
                        item.id +
                        "-312x231.jpg"
                      }
                    />
                  </a>
                )}
              </Draggable>
            ))}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
