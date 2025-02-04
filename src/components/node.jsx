const Node = ({ size, state, onMouseDown, onMouseEnter }) => {
  // Function to determine the background color based on state
  const getColor = () => {
    if (state === "wall") return "bg-black"; // Walls
    if (state === "selected") return "bg-red-500"; // Selected
    return "bg-green-500"; // Default
  };

  return (
    <div
      className={`border border-gray-400 ${getColor()}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
      onMouseDown={onMouseDown} // Start wall-drawing
      onMouseEnter={onMouseEnter} // Drag to draw walls
    ></div>
  );
};

export default Node;
