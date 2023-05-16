const Colors = ({ colors, deleteColor }) => {
  return (
    <div>
      {colors.length > 0 && (
        <h1 className="label block text-sm mt-2 text-gray-500">Colors List</h1>
      )}
      {colors.length > 0 && (
        <div className="flex flex-wrap -mx-1">
          {colors.map((color) => (
            <div className="p-1" key={color}>
              <div
                className="w-[30px] h-[30px] rounded-full cursor-pointer"
                style={{ background: color }}
                onClick={() => deleteColor(color)}
              ></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Colors;
