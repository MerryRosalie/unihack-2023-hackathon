import { z } from "zod";

export const RecipeSchema = z.object({
  name: z.string(),
  image: z.string(),
  prep_time: z.number(),
  cook_time: z.number(),
  servings: z.number(),
  ingredients: z.array(z.string()),
  instructions: z.array(z.string()),
  nutrition: z.object({
    calories: z.number(),
    fat: z.number(),
    carbs: z.number(),
    protein: z.number(),
  }),
  tags: z.array(z.string()),
});

export type Recipe = z.infer<typeof RecipeSchema>;
