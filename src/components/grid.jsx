import { useState, useEffect, useRef } from "react";
import Node from "./Node";

const Grid = () => {
  const containerRef = useRef(null);

  // State variables
  const [gridSize, setGridSize] = useState({ cols: 0, rows: 0, nodeSize: 40 }); // gridSize stores how many columns and rows the grid has
  const [nodes, setNodes] = useState([]); // Array of grid nodes to track their state (one of wall or default)
  const [isMouseDown, setIsMouseDown] = useState(false); // track whether the mouse is down or not 
  const [dragState, setDragState] = useState(null); // Track whether we're adding or removing walls 

  // Function to initialize the grid with outer walls
  const initializeNodes = (cols, rows) => {
    const newNodes = [];
    // creates the nodes and adds boundary walls around the edge
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        let isWall = row === 0 || row === rows - 1 || col === 0 || col === cols - 1;
        newNodes.push({ id: `${row}-${col}`, row, col, state: isWall ? "wall" : "default" });
      }
    }
    return newNodes;
  };

  useEffect(() => {
    const updateGrid = () => {
      if (containerRef.current) {

        // get current dimensions of parent container
        const containerWidth = containerRef.current.offsetWidth; 
        const containerHeight = containerRef.current.offsetHeight;
        
        // Desired node size and the spacing between the nodes 
        const desiredNodeSize = 25;
        const spacing = 4;

        // Calculate the number of columns and rows that will fit
        const cols = Math.floor((containerWidth + spacing) / (desiredNodeSize + spacing));
        const rows = Math.floor((containerHeight + spacing) / (desiredNodeSize + spacing));

        const computedSize = Math.min((containerWidth - (cols - 1) * spacing) / cols,(containerHeight - (rows - 1) * spacing) / rows);
        
        // Set the grid size
        setGridSize({ cols, rows, nodeSize: computedSize });

        // Initialize nodes **after** setting the grid size
        setNodes(initializeNodes(cols, rows));
      }
    };

    updateGrid();
    window.addEventListener("resize", updateGrid);
    return () => window.removeEventListener("resize", updateGrid);
  }, []);

  // Function to toggle a wall when clicking
  const handleMouseDown = (nodeId) => {
    setIsMouseDown(true);
    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        if (node.id === nodeId) {
          const newState = node.state === "wall" ? "default" : "wall";
          setDragState(newState); // Set whether we're adding or removing walls
          return { ...node, state: newState };
        }
        return node;
      })
    );
  };

  // Function to update node state when dragging
  const handleMouseEnter = (nodeId) => {
    if (isMouseDown) {
      setNodes((prevNodes) =>
        prevNodes.map((node) =>
          node.id === nodeId ? { ...node, state: dragState } : node
        )
      );
    }
  };

  // Function to stop dragging
  const handleMouseUp = () => {
    setIsMouseDown(false);
    setDragState(null);
  };

  return (
    <div
      ref={containerRef} // stores a reference to the div to measure its dimensions
      className="w-full h-full border-gray-600 grid" // makes the grid take up all available space
      style={{
        display: "grid", // Use CSS grid to layout the nodes
        gridTemplateColumns: `repeat(${gridSize.cols}, ${gridSize.nodeSize}px)`, //create cols number of columns with nodesize as 
        gridTemplateRows: `repeat(${gridSize.rows}, ${gridSize.nodeSize}px)`,
        gap: "4px",
        overflow: "hidden",
      }}
      onMouseUp={handleMouseUp} // Stop dragging when mouse is released
      onMouseLeave={handleMouseUp} // Stop dragging if mouse leaves grid
    >
      {/* Rendering the nodes, node.map() loops through the array of grid nodes */}
      {nodes.map((node) => (
        // 
        <Node
          key={node.id}
          size={gridSize.nodeSize}
          state={node.state}
          onMouseDown={() => handleMouseDown(node.id)}
          onMouseEnter={() => handleMouseEnter(node.id)}
        />
      ))}
    </div>
  );
};

export default Grid;
