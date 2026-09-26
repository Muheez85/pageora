import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../../services/categoryService";


const CategoriesSection = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
  const fetchCategories = async () => {
    try {
      const data = await getCategories();

      setCategories(data);

    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  fetchCategories();
}, []);

  return (
    <section className="bg-[#FFFDF8] py-20 md:py-24">
      <div className="container mx-auto px-6">

        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#E86A2A]">
              Browse the shelves
            </p>

            <h2 className="font-serif text-4xl leading-tight text-[#124C3B] md:text-5xl">
              What are you in the mood for?
            </h2>
          </div>

          <Link
            to="/categories"
            className="hidden text-sm font-medium text-[#17211D] md:block"
          >
            View all categories 
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.slice(0,5).map((category) => (
            <Link
              key={category.id}
              to={`/books?category=${category.slug}`}
              className="group block overflow-hidden border border-[#DED8CC] bg-[#F7F3EC]"
            >
              <div className="aspect-video-[16/9] overflow-hidden bg-[#124C3B]">
                <div className="h-72 flex justify-center bg-[#124C3B]">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full object-contain"
                    loading="lazy"
                  />
                </div>
              </div>

              <div className="flex items-end justify-between px-4 py-4">
                <div>
                  <h3 className="font-serif text-xl text-[#124C3B]">
                    {category.name}
                  </h3>

                  <span className="mt-1 block text-[11px] text-[#6F756F]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

               
              </div>
            </Link>
          ))}
        </div>

        <Link
          to="/categories"
          className="mt-6 inline-block text-sm font-medium text-[#17211D] underline decoration-[#E86A2A] underline-offset-8 md:hidden"
        >
          View all categories 
        </Link>

      </div>
    </section>
  );
};

export default CategoriesSection;