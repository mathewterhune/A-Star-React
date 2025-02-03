import { useState, useEffect, useRef } from "react";
import Node from "./Node";

const Grid = () => {
  const containerRef = useRef(null);
  const [gridSize, setGridSize] = useState({ cols: 0, rows: 0, nodeSize: 40 });
  const [nodes, setNodes] = useState([]); // Store node states

  // Function to initialize the grid with outer walls
  const initializeNodes = (cols, rows) => {
    const newNodes = [];
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
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;
        const desiredNodeSize = 25;
        const spacing = 4;

        const cols = Math.floor((containerWidth + spacing) / (desiredNodeSize + spacing));
        const rows = Math.floor((containerHeight + spacing) / (desiredNodeSize + spacing));

        const computedSize = Math.min(
          (containerWidth - (cols - 1) * spacing) / cols,
          (containerHeight - (rows - 1) * spacing) / rows
        );

        setGridSize({ cols, rows, nodeSize: computedSize });

        // Initialize nodes **after** setting the grid size
        setNodes(initializeNodes(cols, rows));
      }
    };

    updateGrid();
    window.addEventListener("resize", updateGrid);
    return () => window.removeEventListener("resize", updateGrid);
  }, []);

  // Function to update node state when clicked
  const handleNodeClick = (nodeId) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === nodeId && node.state !== "wall" // Don't change walls
          ? { ...node, state: node.state === "default" ? "selected" : "default" }
          : node
      )
    );
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full border-gray-600 grid"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${gridSize.cols}, ${gridSize.nodeSize}px)`,
        gridTemplateRows: `repeat(${gridSize.rows}, ${gridSize.nodeSize}px)`,
        gap: "4px",
        overflow: "hidden",
      }}
    >
      {nodes.map((node) => (
        <Node
          key={node.id}
          size={gridSize.nodeSize}
          state={node.state}
          onClick={() => handleNodeClick(node.id)}
        />
      ))}
    </div>
  );
};

export default Grid;
