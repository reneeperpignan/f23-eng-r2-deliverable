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

interface sortSpeciesProps {
  species: Species;
  userId: string;
}

export default function SortSpecies({ species, userId }: sortSpeciesProps) {
  // State to track the selected sorting option
  const [sortOption, setSortOption] = useState("common_name"); // Default sorting by common_name

  // Event handler to update the selected sorting option
  const handleSortChange = (event: { target: { value: SetStateAction<string> } }) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    setSortOption(event.target.value);
  };

  //sort species based on drop down value
  let sortedSpecies = [];
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

  return (
    <div>
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

          {/* Add more sorting options as needed */}
        </select>
      </div>

      <div className="flex flex-wrap justify-center">
        {sortedSpecies.map((species) => (
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          <SpeciesCard key={species.id} species={species} userId={userId} />
        ))}
      </div>
    </div>

    // <Dialog open={open} onOpenChange={setOpen}>
    //   <DialogTrigger asChild>
    //     <Button variant="secondary" onClick={() => setOpen(true)}>
    //       <Icons.add className="mr-3 h-5 w-5" />
    //       Add Species
    //     </Button>
    //   </DialogTrigger>
    //   <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
    //     <DialogHeader>
    //       <DialogTitle>Add Species</DialogTitle>
    //       <DialogDescription>
    //         Add a new species here. Click &quot;Add Species&quot; below when you&apos;re done.
    //       </DialogDescription>
    //     </DialogHeader>
    //     <Form {...form}>
    //       <form onSubmit={(e: BaseSyntheticEvent) => void form.handleSubmit(onSubmit)(e)}>
    //         <div className="grid w-full items-center gap-4">
    //           <FormField
    //             control={form.control}
    //             name="scientific_name"
    //             render={({ field }) => (
    //               <FormItem>
    //                 <FormLabel>Scientific Name</FormLabel>
    //                 <FormControl>
    //                   <Input placeholder="Cavia porcellus" {...field} />
    //                 </FormControl>
    //                 <FormMessage />
    //               </FormItem>
    //             )}
    //           />
    //           <FormField
    //             control={form.control}
    //             name="common_name"
    //             render={({ field }) => {
    //               // We must extract value from field and convert a potential defaultValue of `null` to "" because inputs can't handle null values: https://github.com/orgs/react-hook-form/discussions/4091
    //               const { value, ...rest } = field;
    //               return (
    //                 <FormItem>
    //                   <FormLabel>Common Name</FormLabel>
    //                   <FormControl>
    //                     <Input value={value ?? ""} placeholder="Guinea pig" {...rest} />
    //                   </FormControl>
    //                   <FormMessage />
    //                 </FormItem>
    //               );
    //             }}
    //           />
    //           <FormField
    //             control={form.control}
    //             name="kingdom"
    //             render={({ field }) => (
    //               <FormItem>
    //                 <FormLabel>Kingdom</FormLabel>
    //                 {/* Using shadcn/ui form with enum: https://github.com/shadcn-ui/ui/issues/772 */}
    //                 <Select onValueChange={(value) => field.onChange(kingdoms.parse(value))} defaultValue={field.value}>
    //                   <FormControl>
    //                     <SelectTrigger>
    //                       <SelectValue placeholder="Select a kingdom" />
    //                     </SelectTrigger>
    //                   </FormControl>
    //                   <SelectContent>
    //                     <SelectGroup>
    //                       {kingdoms.options.map((kingdom, index) => (
    //                         <SelectItem key={index} value={kingdom}>
    //                           {kingdom}
    //                         </SelectItem>
    //                       ))}
    //                     </SelectGroup>
    //                   </SelectContent>
    //                 </Select>
    //                 <FormMessage />
    //               </FormItem>
    //             )}
    //           />
    //           <FormField
    //             control={form.control}
    //             name="total_population"
    //             render={({ field }) => (
    //               <FormItem>
    //                 <FormLabel>Total population</FormLabel>
    //                 <FormControl>
    //                   {/* Using shadcn/ui form with number: https://github.com/shadcn-ui/ui/issues/421 */}
    //                   <Input
    //                     type="number"
    //                     placeholder="300000"
    //                     {...field}
    //                     onChange={(event) => field.onChange(+event.target.value)}
    //                   />
    //                 </FormControl>
    //                 <FormMessage />
    //               </FormItem>
    //             )}
    //           />
    //           <FormField
    //             control={form.control}
    //             name="image"
    //             render={({ field }) => (
    //               <FormItem>
    //                 <FormLabel>Image URL</FormLabel>
    //                 <FormControl>
    //                   <Input
    //                     placeholder="https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/George_the_amazing_guinea_pig.jpg/440px-George_the_amazing_guinea_pig.jpg"
    //                     {...field}
    //                   />
    //                 </FormControl>
    //                 <FormMessage />
    //               </FormItem>
    //             )}
    //           />
    //           <FormField
    //             control={form.control}
    //             name="description"
    //             render={({ field }) => {
    //               // We must extract value from field and convert a potential defaultValue of `null` to "" because textareas can't handle null values: https://github.com/orgs/react-hook-form/discussions/4091
    //               const { value, ...rest } = field;
    //               return (
    //                 <FormItem>
    //                   <FormLabel>Description</FormLabel>
    //                   <FormControl>
    //                     <Textarea
    //                       value={value ?? ""}
    //                       placeholder="The guinea pig or domestic guinea pig, also known as the cavy or domestic cavy, is a species of rodent belonging to the genus Cavia in the family Caviidae."
    //                       {...rest}
    //                     />
    //                   </FormControl>
    //                   <FormMessage />
    //                 </FormItem>
    //               );
    //             }}
    //           />
    //           <div className="flex">
    //             <Button type="submit" className="ml-1 mr-1 flex-auto">
    //               Add Species
    //             </Button>
    //             <Button
    //               type="button"
    //               className="ml-1 mr-1 flex-auto"
    //               variant="secondary"
    //               onClick={() => setOpen(false)}
    //             >
    //               Cancel
    //             </Button>
    //           </div>
    //         </div>
    //       </form>
    //     </Form>
    //   </DialogContent>
    // </Dialog>
  );
}
