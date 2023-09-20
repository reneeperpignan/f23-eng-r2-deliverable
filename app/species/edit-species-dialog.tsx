import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import type { Database } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { type BaseSyntheticEvent } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Species = Database["public"]["Tables"]["species"]["Row"];

interface EditSpeciesProps {
  species: Species | null;
  onClose: () => void;
}

const kingdoms = z.enum(["Animalia", "Plantae", "Fungi", "Protista", "Archaea", "Bacteria"]);

const speciesSchema = z.object({
  common_name: z.string(),
  //   .nullable()
  //   .transform((val) => (val?.trim() === "" ? null : val?.trim())),
  description: z
    .string()
    .nullable()
    .transform((val) => (val?.trim() === "" ? null : val?.trim())),
  kingdom: kingdoms,
  scientific_name: z
    .string()
    .trim()
    .min(1)
    .transform((val) => val?.trim()),

  total_population: z.number().int().positive().min(0).optional(),

  image: z
    .string()
    .url()
    .nullable()
    .transform((val) => val?.trim()),
});

type FormData = z.infer<typeof speciesSchema>;

export default function EditSpecies({ species, onClose }: EditSpeciesProps) {
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(speciesSchema),
    mode: "onChange",
    defaultValues: {
      common_name: species ? species.common_name ?? "" : "",
      description: species ? species.description ?? "" : "",
      kingdom: species ? species.kingdom : "Animalia",
      scientific_name: species ? species.scientific_name : "",
      total_population: species ? species.total_population ?? undefined : undefined,
      image: species ? species.image ?? "" : "",
    },
  });

  const onSubmit = async (input: FormData) => {
    try {
      const supabase = createClientComponentClient<Database>();
      const { error } = await supabase
        .from("species")
        .update({
          common_name: input.common_name,
          description: input.description,
          kingdom: input.kingdom,
          scientific_name: input.scientific_name,
          total_population: input.total_population,
          image: input.image,
        })
        .eq("id", species ? species.id : "");

      if (error) {
        throw new Error(`Error updating species: ${error.message}`);
      }

      // Provide feedback to the user
      toast({
        title: "Species updated.",
      });

      // Close the dialog
      onClose();

      // Refresh all server components in the current route to display the updated species list after editing.
      router.refresh();
    } catch (error) {
      toast({
        title: "Error updating species.",
      });
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit {species ? species.common_name : ""}</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e: BaseSyntheticEvent) => void form.handleSubmit(onSubmit)(e)}>
          <div className="grid w-full items-center gap-4">
            <Form {...form}>
              <form onSubmit={(e: BaseSyntheticEvent) => void form.handleSubmit(onSubmit)(e)}>
                <div className="grid w-full items-center gap-4">
                  <FormField
                    control={form.control}
                    name="scientific_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Scientific Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="common_name"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Common Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="kingdom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kingdom</FormLabel>
                        {/* Using shadcn/ui form with enum: https://github.com/shadcn-ui/ui/issues/772 */}
                        <Select
                          onValueChange={(value) => field.onChange(kingdoms.parse(value))}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={field.value} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              {kingdoms.options.map((kingdom, index) => (
                                <SelectItem key={index} value={kingdom}>
                                  {kingdom}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="total_population"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total population</FormLabel>
                        <FormControl>
                          {/* Using shadcn/ui form with number: https://github.com/shadcn-ui/ui/issues/421 */}
                          <Input
                            type="number"
                            // value={field.value}
                            min={0}
                            {...field}
                            onChange={(event) => field.onChange(+event.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => {
                      // We must extract value from field and convert a potential defaultValue of `null` to "" because textareas can't handle null values: https://github.com/orgs/react-hook-form/discussions/4091
                      const { value, ...rest } = field;
                      // We must extract value from field and convert a potential defaultValue of `null` to "" because inputs can't handle null values: https://github.com/orgs/react-hook-form/discussions/4091
                      if (value === null) {
                        field.value = "";
                      }
                      return (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea value={field.value} {...rest} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>
              </form>
            </Form>

            <div className="flex">
              <Button type="submit" className="ml-1 mr-1 flex-auto">
                Update
              </Button>
              <Button type="button" className="ml-1 mr-1 flex-auto" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
