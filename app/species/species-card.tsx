"use client";
import { Button } from "@/components/ui/button";
import type { Database } from "@/lib/schema";
import Image from "next/image";
import { useState } from "react";
import SpeciesDetailsDialog from "./species-details-dialog";

type Species = Database["public"]["Tables"]["species"]["Row"];
type Profiles = Database["public"]["Tables"]["profiles"]["Row"];

interface SpeciesCardProps {
  species: Species;
  userId: string;
  profiles: Profiles[] | null;
}

export default function SpeciesCard({ species, userId, profiles }: SpeciesCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="min-w-72 m-4 w-72 flex-none rounded border-2 p-3 shadow">
      <div className="flex h-full flex-col justify-between">
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
      </div>
      {/* Dialog for displaying more details
      Only open the dialog when the dialog hook is open*/}
      {isDialogOpen && (
        <SpeciesDetailsDialog species={species} userId={userId} onClose={closeDialog} profiles={profiles} />
      )}
    </div>
  );
}
