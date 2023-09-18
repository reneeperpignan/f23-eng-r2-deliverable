"use client";
import { Button } from "@/components/ui/button";
import type { Database } from "@/lib/schema";
import Image from "next/image";
import { useState } from "react";
import SpeciesDetailsDialog from "./species-details-dialog";

type Species = Database["public"]["Tables"]["species"]["Row"];

interface SpeciesCardProps {
  species: Species;
  userId: string;
}

export default function SpeciesCard({ species, userId }: SpeciesCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  // //SORTINGGG
  // // Function to sort the species based on the sorting option
  // const sortSpecies = (a: Species, b: Species) => {
  //   if (sortOption === "common_name") {
  //     return a.common_name.localeCompare(b.common_name);
  //   } else if (sortOption === "population") {
  //     return a.population - b.population;
  //   }
  //   // Add more sorting options as needed
  //   return 0; // Default case (no sorting)
  // };
  // //sorting over

  return (
    <div className="min-w-72 m-4 w-72 flex-none rounded border-2 p-3 shadow">
      {species.image && (
        <div className="relative h-40 w-full">
          <Image src={species.image} alt={species.scientific_name} fill style={{ objectFit: "cover" }} />
        </div>
      )}
      <h3 className="mt-3 text-2xl font-semibold">{species.common_name}</h3>
      <h4 className="text-lg font-light italic">{species.scientific_name}</h4>
      <p>{species.description ? species.description.slice(0, 150).trim() + "..." : ""}</p>
      <div className="flex">
        <Button className="mt-3 w-full" onClick={openDialog}>
          Learn More
        </Button>
      </div>
      {/* Dialog for displaying more details
      Only open the dialog when the dialog hook is open*/}
      {isDialogOpen && <SpeciesDetailsDialog species={species} userId={userId} onClose={closeDialog} />}
    </div>
  );
}
