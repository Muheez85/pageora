const Newsletter = () => {
  return (
    <section className="bg-[#F7F3EC] py-20">
      <div className="container mx-auto px-6">

        <div className="mx-auto max-w-3xl text-center">

          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#E86A2A]">
            Stay Inspired
          </p>

          <h2 className="font-serif text-4xl leading-tight text-[#124C3B] md:text-5xl">
            Discover your next favorite story
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-[#6F756F]">
            Get new arrivals, reading recommendations, and exclusive updates
            from Pageora delivered straight to your inbox.
          </p>


          <form className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">

            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full border border-[#DED8CC] bg-[#FFFDF8] px-5 py-3 text-sm text-[#17211D] outline-none placeholder:text-[#6F756F]"
            />


            <button
              type="submit"
              className="bg-[#E86A2A] px-7 py-3 text-sm font-medium text-white transition hover:bg-[#d85f24]"
            >
              Subscribe
            </button>

          </form>

        </div>

      </div>
    </section>
  );
};

export default Newsletter;