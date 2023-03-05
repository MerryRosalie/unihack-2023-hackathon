import Link from "next/link";
import Navbar from "~/components/Navbar";
import recipes from "~/recipes.json";
const RecipesPage = () => {
  return (
    <>
      <Navbar />
      <main className="mx-auto mt-4 max-w-4xl">
        <h1 className="text-5xl font-bold text-neutral-700">Recipes</h1>
        <div className="mt-6 flex flex-wrap">
          {recipes.map((recipe) => (
            <div className="basis-1/2 p-4">
              <Link href={`/recipes/${recipe.id}`}>
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  className="aspect-video object-cover"
                />
                <h2 className="mt-1 text-center text-xl font-bold text-neutral-700">
                  {recipe.name}
                </h2>
              </Link>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default RecipesPage;
