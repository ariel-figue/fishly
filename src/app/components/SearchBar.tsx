import React from "react";

const SearchBar: React.FC<{
  location: string;
  setLocation: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: (location: string) => void;
}> = ({ location, setLocation, handleSearch }) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch(location);
    }
  };

  return (
    <div className="flex items-center justify-center mt-4">
      <input
        type="text"
        value={location}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder="Search for a location..."
        className="border p-2 rounded-l-lg w-80 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={() => handleSearch(location)}
        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-r-lg"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;

