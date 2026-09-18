// import { useEffect, useState } from "react";
// import { getBooks } from "../../services/bookService";

// const FeaturedBooks = () => {
//   const [books, setBooks] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchBooks = async () => {
//     try {
//       const data = await getBooks();

//       setBooks(data);
//     } catch (error) {
//       console.log("Failed to fetch books:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBooks();
//   }, []);

//   if (loading) {
//     return (
//       <section className="py-20">
//         <p className="text-center">Loading books...</p>
//       </section>
//     );
//   }

//   return (
//     <section className="py-20">
//       <div className="container mx-auto px-6">

//         {/* Heading */}
//         <div className="mb-10">

//             <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#E86A2A]">
//                Editor's Selection
//             </p>
//           {/* <h2 className="text-3xl font-bold">
           
//           </h2> */}
//            <h2 className="font-serif text-4xl leading-tight text-[#124C3B] md:text-5xl">
//               Discover books readers love
//             </h2>
//           <p className="text-gray-500 mt-2">
           
//           </p>
//         </div>


//         {/* Books Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

//           {books.map((book) => (
//             <div
//               key={book.id}
//               className="rounded-xl overflow-hidden border bg-white"
//             >

//               {/* Book Cover */}
//               <div className="h-64 bg-gray-100">
//                 <img
//                   src={book.coverImage}
//                   alt={book.title}
//                   className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
//                 />
//               </div>


//               {/* Book Details */}
//               <div className="p-4">

//                 <h3 className="font-semibold text-lg">
//                   {book.title}
//                 </h3>

//                 <p className="text-sm text-gray-500 mt-1">
//                   {book.authors?.[0]?.name}
//                 </p>

//                 <p className="font-bold mt-3">
//                   ₦{book.price.toLocaleString()}
//                 </p>

//               </div>

//             </div>
//           ))}

//         </div>

//       </div>
//     </section>
//   );
// };

// export default FeaturedBooks;


import { useEffect, useState } from "react";
import { getBooks } from "../../services/bookService";
import BookCard from "../../components/BookCard";

const FeaturedBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    try {
      const data = await getBooks();

      setBooks(data);
    } catch (error) {
      console.error("Failed to fetch books:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <section className="bg-[#F7F3EC] py-20 md:py-24">
      <div className="container mx-auto px-6">

        {/* Section Heading */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#E86A2A]">
              Editor's Picks
            </p>

            <h2 className="font-serif text-4xl leading-tight text-[#124C3B] md:text-5xl">
              Books worth making room for.
            </h2>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <p className="text-sm text-[#6F756F]">
            Loading books...
          </p>
        )}

        {/* Books */}
        {!loading && (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 md:grid-cols-4 md:gap-x-7">
            {books.slice(0, 4).map((book) => (
              <BookCard
                key={book.id}
                book={book}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default FeaturedBooks;