import React, { useEffect, useState } from "react";
import Layout from "~/components/Layout";

interface DetailsInterface {
  name: string;
  calories: number;
  caloriesUnit: string;
  carbs: number;
  carbsUnit: string;
  fat: number;
  fatUnit: string;
  protein: number;
  proteinUnit: string;
}

export default function Analyze() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<DetailsInterface | null>(null);

  const handleRender = () => {
    if (loading && !details) {
      return <h2 className="text-bold text-gray-400">Loading...</h2>;
    } else if (!loading && !details) {
      return <h2 className="text-bold text-gray-400">No Details Found 😔</h2>;
    } else if (!loading && details) {
      return (
        <div>
          <div className="my-2 flex justify-between">
            <h4 className="font-bold text-emerald-600">Name</h4>
            <p>
              {details.name.charAt(0).toUpperCase() + details.name.slice(1)}
            </p>
          </div>
          <div className="my-2 flex justify-between">
            <h4 className="font-bold text-emerald-600">Calories</h4>
            <p>
              {details.calories}&nbsp;
              <span>{details.caloriesUnit}</span>
            </p>
          </div>
          <div className="my-2 flex justify-between">
            <h4 className="font-bold text-emerald-600">Carbs</h4>
            <p>
              {details.carbs}
              <span>{details.carbsUnit}</span>
            </p>
          </div>
          <div className="my-2 flex justify-between">
            <h4 className="font-bold text-emerald-600">Fat</h4>
            <p>
              {details.fat}
              <span>{details.fatUnit}</span>
            </p>
          </div>
          <div className="my-2 flex justify-between">
            <h4 className="font-bold text-emerald-600">Protein</h4>
            <p>
              {details.protein}
              <span>{details.proteinUnit}</span>
            </p>
          </div>
        </div>
      );
    }
  };

  useEffect(() => {
    if (!selectedImage) return;
    setLoading(true);
    (async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const formData = new FormData();
      formData.append("file", selectedImage);

      try {
        const response = await fetch(
          `https://api.spoonacular.com/food/images/analyze?apiKey=${process.env.NEXT_PUBLIC_IMAGE_RECOGNITION_API_KEY}`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (response.ok) {
          const data = await response.json();
          setDetails({
            name: data.category.name,
            calories: data.nutrition.calories.value,
            caloriesUnit: data.nutrition.calories.unit,
            carbs: data.nutrition.carbs.value,
            carbsUnit: data.nutrition.carbs.unit,
            fat: data.nutrition.fat.value,
            fatUnit: data.nutrition.fat.unit,
            protein: data.nutrition.protein.value,
            proteinUnit: data.nutrition.protein.unit,
          });
          setLoading(false);
        } else {
          console.error(`HTTP error! status: ${response.status}`);
          setLoading(false);
        }
      } catch (error) {
        console.error(`Fetch error: ${error}`);
      }
    })();
    return () => {};
  }, [selectedImage]);

  return (
    <Layout>
      <div className="m-auto h-screen max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center gap-4 max-md:flex-wrap">
          <div className="flex-[50%] flex-grow">
            <h1 className="my-8 mt-8 text-3xl font-bold text-emerald-600">
              Image Nutrients Analyzer
            </h1>
            {selectedImage ? (
              <div>
                <img
                  className="aspect-square w-full bg-cover"
                  src={URL.createObjectURL(selectedImage)}
                />
                <button
                  className="float-right my-2 rounded-md bg-red-600 px-4 py-2 font-bold text-white"
                  onClick={() => setSelectedImage(null)}
                >
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <label className="flex h-[296px] w-full cursor-pointer justify-center rounded-md border-2 border-dashed border-gray-300 bg-white px-4 transition hover:border-gray-400 focus:outline-none">
                  <span className="flex items-center space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <span className="font-medium text-gray-600">
                      Drop files to Attach, or <pre className="inline"></pre>
                      <span className="text-blue-600 underline">browse</span>
                    </span>
                  </span>
                  <input
                    type="file"
                    id="image-input"
                    className="hidden"
                    onChange={(event) => {
                      if (!event.target.files || !event.target.files[0]) return;
                      setSelectedImage(event.target.files[0]);
                    }}
                  />
                </label>
              </div>
            )}
          </div>
          <div className="flex-[50%]">
            <h1 className="my-8 mt-8 text-3xl font-bold text-emerald-600">
              Results
            </h1>
            <p className="mb-8 text-sm text-gray-500">
              Welcome to our image analyser for nutrients! Just upload a picture
              of your food, and we'll analyse it and tell you what nutrients it
              has. Please note that our system can only find one food per image
              right now. So, make sure your picture only has one food item in it
              for the best results.
            </p>
            {handleRender()}
          </div>
        </div>
      </div>
    </Layout>
  );
}
