import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import type { Database } from "@/lib/schema";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import EditSpecies from "./edit-species-dialog";

type Species = Database["public"]["Tables"]["species"]["Row"];
type Profiles = Database["public"]["Tables"]["profiles"]["Row"];

interface SpeciesDetailsDialogProps {
  species: Species;
  profiles: Profiles;
  onClose: () => void;
  userId: string;
}

export default function SpeciesDetailsDialog({ species, profiles, onClose, userId }: SpeciesDetailsDialogProps) {
  const router = useRouter();
  const isCurrentUser = userId === species.author;

  // // State to store the author's email
  // const [authorEmail, setAuthorEmail] = useState("");

  // // Function to fetch and set the author's email
  // const fetchAuthorEmail = async () => {
  //   try {
  //     const supabase = createClientComponentClient<Database>();

  //     // Perform the join query
  //     const { data: profiles, error } = await supabase.from("profiles").select(`
  //     email,
  //     species(
  //       author
  //     )`);

  //     const { data: error } = await supabase.from("profiles").select("*");
  //     console.log(data);

  //     if (error) {
  //       throw new Error(`Error fetching author's email1: ${error.message}`);
  //     }

  //     // Set the author's email
  //     // setAuthorEmail(profiles?.email || "");
  //   } catch (error) {
  //     // Handle errors
  //     console.error("Error fetching author's email2:", error);
  //   }
  // };

  // // Fetch the author's email when the component mounts
  // useEffect(() => {
  //   fetchAuthorEmail();
  // }, [species.id]); // Re-fetch when the species ID changes

  //DELETE a species
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this species?")) {
      try {
        const supabase = createClientComponentClient<Database>();

        const { error } = await supabase.from("species").delete().eq("id", species.id);
        //try console.logging
        //console.log("deleted");

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
      <DialogContent>
        <DialogTitle>{species.common_name}</DialogTitle>
        <div>
          {species.image && (
            <div className="relative h-80 w-full overflow-hidden">
              {/* Adjust height to your preference */}
              <Image src={species.image} alt={species.scientific_name} fill style={{ objectFit: "cover" }} />
            </div>
          )}
          <h3 className="mt-3 text-2xl font-semibold">{species.common_name}</h3>
          <h4 className="text-lg font-light italic">{species.scientific_name}</h4>
          <p>{species.description ? species.description : ""}</p>
          <p>Population: {species.total_population ? species.total_population : ""}</p>
          <p>ID: {species.id ? species.id : ""}</p>
          <p>author: </p>
        </div>
        <div className="flex">
          <Button type="submit" className="ml-1 mr-1 flex-auto" onClick={handleEditClick} disabled={!isCurrentUser}>
            Edit
          </Button>
          <Button
            type="button"
            className="ml-1 mr-1 flex-auto"
            variant="destructive"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
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
