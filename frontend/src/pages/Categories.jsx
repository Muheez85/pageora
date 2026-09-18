import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";

import { getCategories } from "../services/categoryService";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getCategories();

        setCategories(data);
      } catch (error) {
        console.error("GET CATEGORIES ERROR:", error);

        setError(
          error.response?.data?.message ||
            "We couldn't load the categories."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading) {
    return (
      <main className="min-h-[70vh]">
        <div className="container mx-auto px-6 py-20">
          <p className="text-sm text-[#6F756F]">
            Loading categories...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-[70vh]">
        <div className="container mx-auto px-6 py-20">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      {/* Hero */}
      <section className="border-b border-[#DED8CC] py-14 sm:py-20">
        <div className="container mx-auto px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#E86A2A]">
            Browse by category
          </p>

          <h1 className="mt-4 max-w-2xl text-4xl leading-tight text-[#124C3B] sm:text-5xl lg:text-6xl">
            Find your next great read.
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-[#6F756F] sm:text-base">
            Explore our collection by category and discover books
            that match what you're curious about.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-6">
          {categories.length === 0 ? (
            <div className="border border-[#DED8CC] bg-[#FFFDF8] px-6 py-14 text-center">
              <BookOpen
                size={30}
                strokeWidth={1.5}
                className="mx-auto text-[#124C3B]"
              />

              <h2 className="mt-4 text-2xl text-[#124C3B]">
                No categories yet
              </h2>

              <p className="mt-2 text-sm text-[#6F756F]">
                Categories will appear here once they are added.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/books?category=${category.slug}`}
                  className="group overflow-hidden border border-[#DED8CC] bg-[#FFFDF8] transition hover:-translate-y-1 hover:border-[#124C3B]"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-[#F0F1F2]">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <BookOpen
                          size={38}
                          strokeWidth={1.4}
                          className="text-[#124C3B]"
                        />
                      </div>
                    )}
                  </div>

                  <div className="p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-4">
                      <h2 className="text-2xl text-[#124C3B]">
                        {category.name}
                      </h2>

                      <ArrowRight
                        size={20}
                        strokeWidth={1.7}
                        className="shrink-0 text-[#E86A2A] transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </div>

                    <p className="mt-2 text-sm text-[#6F756F]">
                      Explore books in this category
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Categories;