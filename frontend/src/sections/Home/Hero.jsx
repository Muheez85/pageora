function Hero() {
  return (
    <main>
      <section className="border-b border-[#DED8CC] bg-[#F7F3EC]">
        <div className="mx-auto grid min-h-600px max-w-7xl items-center gap-12 px-5 py-16 md:grid-cols-2 md:px-8 lg:py-20">

          {/* Text */}
          <div className="max-w-2xl">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-[#E86A2A]">
              For people who still love books
            </p>

            <h1 className="text-5xl leading-[1.05] text-[#124C3B] sm:text-6xl lg:text-7xl">
              Your next favorite book is probably here.
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-[#6F756F] md:text-lg">
              Discover stories worth getting lost in, ideas worth thinking
              about, and books you'll want to keep on your shelf.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/books"
                className="bg-[#124C3B] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0d3d2f] rounded-3xl"
              >
                Browse books
              </a>

              <a
                href="/categories"
                className="border border-[#124C3B] px-6 py-3.5 text-sm font-semibold text-[#124C3B] transition hover:bg-[#124C3B] rounded-3xl hover:text-white"
              >
                Explore categories
              </a>
            </div>
          </div>

          {/* Visual */}
          <div className="relative flex justify-center md:justify-end">
            <div className="aspect-4/5 w-full max-w-md overflow-hidden bg-[#124C3B]">
            {/* planning on replacing the image  */}
              <img
                src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=85"
                alt="Open book"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}

export default Hero;