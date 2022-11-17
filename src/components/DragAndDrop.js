import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';


const itemsFromBackend = [
    { id: uuidv4(), content: "First" },
    { id: uuidv4(), content: "Second" },
    { id: uuidv4(), content: "Third" },
    { id: uuidv4(), content: "Fourth" },
    { id: uuidv4(), content: "Fifth" },
];

const columnsFromBackend = {
    [uuidv4()]: {
        items: itemsFromBackend
    },
    [uuidv4()]: {
        items: []
    },
    [uuidv4()]: {
        items: []
    },
    [uuidv4()]: {
        items: []
    }
};


const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
        const sourceColumn = columns[source.droppableId];
        const destColumn = columns[destination.droppableId];
        const sourceItems = [...sourceColumn.items];
        const destItems = [...destColumn.items];
        const [removed] = sourceItems.splice(source.index, 1);
        destItems.splice(destination.index, 0, removed);
        setColumns({
            ...columns,
            [source.droppableId]: {
                ...sourceColumn,
                items: sourceItems
            },
            [destination.droppableId]: {
                ...destColumn,
                items: destItems
            }
        });
    } else {
        const column = columns[source.droppableId];
        const copiedItems = [...column.items];
        const [removed] = copiedItems.splice(source.index, 1);
        copiedItems.splice(destination.index, 0, removed);
        setColumns({
            ...columns,
            [source.droppableId]: {
                ...column,
                items: copiedItems
            }
        });
    }
};



export default function DragAndDrop() {
    const [columns, setColumns] = useState(columnsFromBackend);
    return (
        <>
            <div className='py-6 font-bold text-2xl underline flex justify-center'>Drag and Drop</div>
            <div className='flex justify-center mt-0'>
                <DragDropContext
                    onDragEnd={result => onDragEnd(result, columns, setColumns)}
                >
                    {Object.entries(columns).map(([columnId, column], index) => {
                        return (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center"
                                }}
                                key={columnId}
                            >
                                <h2 className='text-xl font-bold underline py-2'>{column.name}</h2>
                                <div className='m-2'>
                                    <Droppable droppableId={columnId} key={columnId}>
                                        {(provided, snapshot) => {
                                            return (
                                                <div
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}
                                                    style={{
                                                        background: snapshot.isDraggingOver
                                                            ? "#44403c"
                                                            : "#44403c",
                                                        padding: 8,
                                                        width: 250,
                                                        minHeight: 500,
                                                        borderRadius: 7
                                                    }}
                                                >
                                                    {column.items.map((item, index) => {
                                                        return (
                                                            <Draggable
                                                                key={item.id}
                                                                draggableId={item.id}
                                                                index={index}
                                                            >
                                                                {(provided, snapshot) => {
                                                                    return (
                                                                        <div
                                                                            ref={provided.innerRef}
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                            style={{
                                                                                userSelect: "none",
                                                                                padding: 12,
                                                                                margin: "0 0 7px 0",
                                                                                minHeight: "40px",
                                                                                borderRadius: 20,
                                                                                textAlign: "center",
                                                                                fontSize: 16,
                                                                                fontWeight: 500,
                                                                                backgroundColor: snapshot.isDragging
                                                                                    ? "#ca8a04"
                                                                                    : "#f59e0b",
                                                                                color: "#1c1917",
                                                                                ...provided.draggableProps.style
                                                                            }}
                                                                        >
                                                                            {item.content}
                                                                        </div>
                                                                    );
                                                                }}
                                                            </Draggable>
                                                        );
                                                    })}
                                                    {provided.placeholder}
                                                </div>
                                            );
                                        }}
                                    </Droppable>
                                </div>
                            </div>
                        );
                    })}
                </DragDropContext>
            </div>
        </>
    )
}
