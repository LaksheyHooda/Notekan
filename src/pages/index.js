import { useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  resetServerContext,
} from "react-beautiful-dnd";
import Column from "@/components/column";

const INITIAL_COLUMN_ORDER = ["column-1", "column-2", "column-3"];

const INITIAL_COL_DATA = {
  "column-1": {
    id: "column-1",
    title: "To Do",
    itemsOrder: [],
  },
  "column-2": {
    id: "column-2",
    title: "In Progress",
    itemsOrder: [],
  },
  "column-3": {
    id: "column-3",
    title: "Finished",
    itemsOrder: [],
  },
};

const ITEMS = {
  
};

// Function to generate a unique ID
const generateUniqueId = (prefix = 'item') => {
  return `${prefix}-${new Date().getTime()}-${Math.random().toString(36).substr(2, 9)}`;
};

//add this if using next.js and keep the strict mode to false
export async function getServerSideProps(context) {
  resetServerContext();
  return {
    props: {},
  };
}

export default function Home(documentData) {
  const [columnsOrder, setColumnsOrder] = useState(INITIAL_COLUMN_ORDER);
  const [data, setData] = useState(INITIAL_COL_DATA);
  const [items, setItems] = useState(ITEMS);
  const [useCases, setUseCases] = useState([])
  const [vaidationMetrics , setValidationMetrics] = useState([])

  useEffect(() => {
    if (documentData && documentData.documentData) {
      setUseCases(documentData.documentData.data.user_stories)
      setValidationMetrics(documentData.documentData.data.validation_metrics)

      // Initialize an empty object to store new items
      let newItems = {};
      // Loop over each requirement element
      documentData.documentData.data.requirements.forEach(requirement => {
        const newItemId = generateUniqueId();  // Generate unique ID for each new item
        // Create a new item entry
        newItems[newItemId] = {
          id: newItemId,
          title: requirement,
        };
      });

      // Update the items state with the new items
      setItems(prevItems => ({...prevItems, ...newItems}));

      // Assuming we're adding to the first column, update it with new items IDs
      const newItemsOrder = [...data['column-1'].itemsOrder, ...Object.keys(newItems)];
      setData(prevData => ({
        ...prevData,
        'column-1': {
          ...prevData['column-1'],
          itemsOrder: newItemsOrder,
        }
      }));
    }
  }, [documentData]);

  const handleDragDrop = (results) => {
    const { source, destination, type } = results;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const sourceIndex = source.index;
    const destinationIndex = destination.index;

    if (type === "COLUMN") {
      //dragging the columns
      const reorderedColumns = [...columnsOrder];
      const [removedItem] = reorderedColumns.splice(sourceIndex, 1);
      reorderedColumns.splice(destinationIndex, 0, removedItem);

      setColumnsOrder(reorderedColumns);
      //save the reordered column in database

      return;
    } else {
      //changes within same column
      if (source.droppableId === destination.droppableId) {
        const source_col_id = source.droppableId;
        const new_items_id_collection = [...data[source_col_id].itemsOrder];
        const [deleted_item_id] = new_items_id_collection.splice(
          sourceIndex,
          1
        );
        new_items_id_collection.splice(destinationIndex, 0, deleted_item_id);
        const new_data = { ...data };
        new_data[source_col_id].itemsOrder = new_items_id_collection;
        setData(new_data);

        //update the db
      } else {
        //changes within different col
        const source_col_id = source.droppableId,
          dest_col_id = destination.droppableId;

        const new_source_items_id_collc = [...data[source_col_id].itemsOrder];
        const new_dest_items_id_collc = [...data[dest_col_id].itemsOrder];
        const [deleted_item_id] = new_source_items_id_collc.splice(
          sourceIndex,
          1
        );

        new_dest_items_id_collc.splice(destinationIndex, 0, deleted_item_id);
        const new_data = { ...data };
        new_data[source_col_id].itemsOrder = new_source_items_id_collc;
        new_data[dest_col_id].itemsOrder = new_dest_items_id_collc;

        setData(new_data);

        //update the db
      }
    }
  };

  return (
    <div className="flex h-full w-full items-center  flex-col">
      <p className="font-bold text-4xl mt-10 text-black">
        Requirements Kanban Board
      </p>
      {/* Set up DragDropContext */}
      <DragDropContext onDragEnd={handleDragDrop}>
        {/* Render Droppable area for columns */}
        <Droppable droppableId="ROOT" type="COLUMN" direction="HORIZONTAL">
          {(provided) => (
            <div
              className="flex items-center w-full md:max-w-6xl justify-center border min-h-96 py-4 mt-6 rounded-md overflow-x-scroll md:overflow-hidden bg-white"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {/* Map through columnsOrder to render each column */}
              {columnsOrder.map((colId, index) => {
                const columnData = data[colId];
                return (
                  <Draggable
                    draggableId={columnData.id}
                    key={columnData.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        className="rounded-md border flex flex-col max-w-xs mx-3"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        <div
                          {...provided.dragHandleProps}
                          className="flex items-center justify-between w-80 gap-2 p-4 border-b border-b-gray-700 rounded-t-md"
                        >
                          <p className="text-xl font-bold">
                            {columnData.title}
                          </p>
                        </div>

                        {/* Render items within the column */}
                        <Column {...columnData} ITEMS={items} />
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <p className="font-bold text-4xl mt-10 pb-10 text-black">
        Use Cases
      </p>
      <ul className="list-none max-w-3xl pl-10">
        {useCases.map((useCase, index) => (
          <li key={index} className="mt-2">
            <label className="flex items-center text-left">
              <input
                type="checkbox"
                className="mr-2"
              />
              {useCase}
            </label>
          </li>
        ))}
      </ul>
      <p className="font-bold text-4xl mt-10 pb-10 text-black">
        Validation Metrics
      </p>
      <ul className="max-w-3xl pl-10 pb-10 list-none">
        {vaidationMetrics.map((metric, index) => (
          <li key={index} className="mt-2">
            <label className="flex items-center text-left">
              <input
                type="checkbox"
                className="mr-2"
              />
              {metric}
            </label>
          </li>
        ))}
      </ul>
    </div>
    

  );
}
