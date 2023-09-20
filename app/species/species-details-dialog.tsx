import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import type { Database } from "@/lib/schema";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import EditSpecies from "./edit-species-dialog";
import GetAuthor from "./get-author";

type Species = Database["public"]["Tables"]["species"]["Row"];
type Profiles = Database["public"]["Tables"]["profiles"]["Row"];

interface SpeciesDetailsDialogProps {
  species: Species | null;
  onClose: () => void;
  userId: string;
  profiles: Profiles[] | null; // Include profiles data
}

export default function SpeciesDetailsDialog({ species, onClose, userId, profiles }: SpeciesDetailsDialogProps) {
  const router = useRouter();
  const isCurrentUser = species ? userId === species.author : false;

  //DELETE a species

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this species?")) {
      try {
        const supabase = createClientComponentClient<Database>();

        const { error } = await supabase
          .from("species")
          .delete()
          .eq("id", species ? species.id : "");

        if (error) {
          throw new Error(`Error deleting species: ${error.message}`);
        }

        // Provide feedback to the user
        toast({
          title: "Species deleted.",
        });

        // Close the dialog
        onClose();

        // Refresh all server components in the current route to display the updated species list after deletion.
        router.refresh();
      } catch (error) {
        // console.error("Error deleting species:", error);
        toast({
          title: "Error deleting species.",
        });
      }
    }
  };

  //handle editing
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
        {/* <DialogTitle>{species ? species.common_name : ""}</DialogTitle> */}
        <div>
          {species
            ? species.image && (
                <div className="relative h-80 w-full overflow-hidden">
                  {/* Adjust height to your preference */}
                  <Image src={species.image} alt={species.scientific_name} fill style={{ objectFit: "cover" }} />
                </div>
              )
            : ""}
          <h3 className="mt-3 text-2xl font-semibold">{species ? species.common_name : ""}</h3>
          <h4 className="text-lg font-light italic">{species ? species.scientific_name : ""}</h4>
          <p>{species ? (species.description ? species.description : "") : ""}</p>
          <p>Population: {species ? (species.total_population ? species.total_population : "") : ""}</p>
          <p>Kingdom: {species ? (species.kingdom ? species.kingdom : "") : ""} </p>
          <p>
            <GetAuthor author={species ? species.author : ""} profiles={profiles} />
          </p>
        </div>
        <div className="flex">
          <Button type="submit" className="ml-1 mr-1 flex-auto" onClick={handleEditClick} disabled={!isCurrentUser}>
            Edit
          </Button>
          <Button
            type="button"
            className="ml-1 mr-1 flex-auto"
            variant="destructive"
            onClick={handleDelete}
            disabled={!isCurrentUser}
          >
            Delete
          </Button>
          <Button type="button" className="ml-1 mr-1 flex-auto" variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>

      {/* Render the EditSpecies component when editing is enabled */}
      {isEditing && <EditSpecies species={species} onClose={() => setIsEditing(false)} />}
    </Dialog>
  );
}
