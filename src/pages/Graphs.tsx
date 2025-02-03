import Grid from "../components/Grid";

const Graphs = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-500">
      <div className="w-[90%] h-[90%] bg-white flex items-center justify-center rounded-lg shadow-lg border border-gray-300 overflow-hidden">
        <Grid />
      </div>
    </div>
  );
};

export default Graphs;
