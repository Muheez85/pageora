import whychooseus from "../../assets/whychooseus.jpg"

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-[#FFFDF8]">
      <div className="container mx-auto px-6">

        <div className="grid items-center gap-12 md:grid-cols-2">

          {/* Image */}
          <div className="h-500px overflow-hidden">
            <img
              src={whychooseus}
              alt="Pageora bookstore"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>


          {/* Content */}
          <div>

            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#E86A2A]">
              Why Pageora
            </p>

            <h2 className="font-serif text-4xl text-[#124C3B]">
              A place where every reader finds a story
            </h2>


            <p className="mt-5 text-[#6F756F]">
              From timeless classics to modern discoveries,
              Pageora helps readers explore books that inspire,
              educate, and entertain.
            </p>


            <div className="mt-8 space-y-6">

              <div>
                <h3 className="font-semibold text-[#124C3B]">
                  Curated Collection
                </h3>
                <p className="text-sm text-[#6F756F]">
                  Carefully selected books across different genres.
                </p>
              </div>


              <div>
                <h3 className="font-semibold text-[#124C3B]">
                  Trusted Authors
                </h3>
                <p className="text-sm text-[#6F756F]">
                  Discover stories from respected writers.
                </p>
              </div>


              <div>
                <h3 className="font-semibold text-[#124C3B]">
                  Simple Ordering
                </h3>
                <p className="text-sm text-[#6F756F]">
                  Find your next book and order easily.
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;