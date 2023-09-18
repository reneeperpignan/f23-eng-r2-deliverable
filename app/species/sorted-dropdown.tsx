/* eslint-disable @typescript-eslint/no-unsafe-argument */
"use client";
import { type Database } from "@/lib/schema";
import { useState, type SetStateAction } from "react";
import SpeciesCard from "./species-card";
// import React from "react";

// const SortDropdown: React.FC<SortDropdownProps> = () => {
//   return (
//     <div>
//       <label htmlFor="sort">Sort by:</label>
//       <select id="sort">
//         <option value="common_name">Common Name</option>
//         <option value="scientific_name">Scientific Name</option>
//         {/* Add more sorting options as needed */}
//       </select>
//     </div>
//   );
// };

// export default SortDropdown;
type Species = Database["public"]["Tables"]["species"]["Row"];
type Profiles = Database["public"]["Tables"]["profiles"]["Row"];

interface sortSpeciesProps {
  species: Species;
  profiles: Profiles;
  userId: string;
}

export default function SortSpecies({ species, profiles, userId }: sortSpeciesProps) {
  // State to track the selected sorting option
  const [sortOption, setSortOption] = useState("common_name"); // Default sorting by common_name
  const [filterOption, setFilterOption] = useState("none"); // Default sorting by common_name

  // Event handler to update the selected sorting option
  const handleSortChange = (event: { target: { value: SetStateAction<string> } }) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    setSortOption(event.target.value);
  };

  // Event handler to update the selected sorting option
  const handleFilterChange = (event: { target: { value: SetStateAction<string> } }) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    setFilterOption(event.target.value);
  };

  //sort species based on drop down value
  let sortedSpecies = [];
  let filteredSpecies = [];

  function animalia(species: { kingdom: string }) {
    return species.kingdom === "Animalia";
  }

  function fungi(species: { kingdom: string }) {
    return species.kingdom === "Fungi";
  }

  function plantae(species: { kingdom: string }) {
    return species.kingdom === "Plantae";
  }

  function protista(species: { kingdom: string }) {
    return species.kingdom === "Protista";
  }

  function archaea(species: { kingdom: string }) {
    return species.kingdom === "Archaea";
  }

  function bacteria(species: { kingdom: string }) {
    return species.kingdom === "Bacteria";
  }

  if (sortOption === "common_name") {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    sortedSpecies = species ? species.sort((a, b) => a.common_name.localeCompare(b.common_name)) : [];
  } else if (sortOption === "scientific_name") {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    sortedSpecies = species ? species.sort((a, b) => a.scientific_name.localeCompare(b.scientific_name)) : [];
  } else if (sortOption === "populationasc") {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    sortedSpecies = species ? species.sort((a, b) => a.total_population - b.total_population) : [];
  } else if (sortOption === "populationdec") {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    sortedSpecies = species ? species.sort((a, b) => b.total_population - a.total_population) : [];
  } else if (sortOption === "newest") {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    sortedSpecies = species ? species.sort((a, b) => b.id - a.id) : [];
  } else if (sortOption === "oldest") {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    sortedSpecies = species ? species.sort((a, b) => a.id - b.id) : [];
  }

  if (filterOption === "none") {
    filteredSpecies = sortedSpecies ? sortedSpecies : [];
  } else if (filterOption === "animalia") {
    filteredSpecies = sortedSpecies ? sortedSpecies.filter(animalia) : [];
  } else if (filterOption === "fungi") {
    filteredSpecies = sortedSpecies ? sortedSpecies.filter(fungi) : [];
  } else if (filterOption === "plantae") {
    filteredSpecies = sortedSpecies ? sortedSpecies.filter(plantae) : [];
  } else if (filterOption === "protista") {
    filteredSpecies = sortedSpecies ? sortedSpecies.filter(protista) : [];
  } else if (filterOption === "archaea") {
    filteredSpecies = sortedSpecies ? sortedSpecies.filter(archaea) : [];
  } else if (filterOption === "bacteria") {
    filteredSpecies = sortedSpecies ? sortedSpecies.filter(bacteria) : [];
  }

  return (
    <div>
      <div className="flex flex-wrap justify-evenly">
        <div>
          <label htmlFor="sortDropdown" className="mr-2">
            Sort By:
          </label>
          <select id="sortDropdown" value={sortOption} onChange={handleSortChange} className="rounded border p-1">
            <option value="common_name">Common Name</option>
            <option value="scientific_name">Scientific Name</option>
            <option value="populationasc">Population (ascending)</option>
            <option value="populationdec">Population (decending)</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

        <div>
          <label htmlFor="filterDropdown" className="mr-2">
            Filter By:
          </label>
          <select id="filterDropdown" value={filterOption} onChange={handleFilterChange} className="rounded border p-1">
            <option value="none">None</option>
            <option value="animalia">Animalia</option>
            <option value="fungi">Fungi</option>
            <option value="plantae">Plantae</option>
            <option value="protista">Protista</option>
            <option value="archaea">Archaea</option>
            <option value="bacteria">Bacteria</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap justify-center">
        {filteredSpecies.map((species) => (
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          <SpeciesCard key={species.id} species={species} profiles={profiles} userId={userId} />
        ))}
      </div>
    </div>
  );
}
