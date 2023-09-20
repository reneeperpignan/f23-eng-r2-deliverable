import type { Database } from "@/lib/schema";

type Profiles = Database["public"]["Tables"]["profiles"]["Row"];

interface getAuthorProps {
  author: string;
  profiles: Profiles[] | null;
}

export default function GetAuthor({ author, profiles }: getAuthorProps) {
  // Check if profiles is null or empty
  if (!profiles) {
    return <span>Unknown Author</span>;
  }

  // Find the author's profile based on the species.author value
  const authorProfile = profiles.find((profile) => profile.id === author);
  let name = "";
  if (authorProfile?.display_name) {
    name = authorProfile.display_name;
  }

  if (authorProfile) {
    return (
      <div>
        <p>author: {name ? name : ""}</p>
        <p>author email: {authorProfile.email}</p>
      </div>
    ); // Display the author's name or relevant information
  } else {
    return <span>Unknown Author</span>; // Handle the case when the author's profile is not found
  }
}
