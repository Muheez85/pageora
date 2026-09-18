import { Link } from "react-router-dom";

const footerSections = [
  {
    title: "Explore",
    links: [
      {
        name: "Books",
        path: "/books",
      },
      {
        name: "Categories",
        path: "/categories",
      },
      {
        name: "New Arrivals",
        path: "/books?sort=new",
      },
      {
        name: "Best Sellers",
        path: "/books?sort=popular",
      },
    ],
  },

  {
    title: "Company",
    links: [
      {
        name: "About Us",
        path: "/about",
      },
      {
        name: "Contact",
        path: "/contact",
      },
      {
        name: "Privacy Policy",
        path: "/privacy",
      },
      {
        name: "Terms",
        path: "/terms",
      },
    ],
  },
];


const Footer = () => {
  return (
    <footer className="bg-[#124C3B] text-[#FFFDF8]">

      <div className="container border-t mx-auto px-6 py-10">

        <div className="grid gap-10 md:grid-cols-4">


          {/* Brand */}
          <div>

            <h2 className="font-serif text-3xl">
              Pageora
            </h2>

            <p className="mt-4 max-w-xs text-sm leading-6 text-[#D9DED8]">
              A place where readers discover meaningful stories,
              timeless classics, and new perspectives.
            </p>

          </div>


          {/* Dynamic Links */}
          {footerSections.map((section) => (
            <div key={section.title}>

              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#E86A2A]">
                {section.title}
              </h3>


              <ul className="space-y-3 text-sm text-[#D9DED8]">

                {section.links.map((link) => (
                  <li key={link.name}>

                    <Link
                      to={link.path}
                      className="transition hover:text-white"
                    >
                      {link.name}
                    </Link>

                  </li>
                ))}

              </ul>

            </div>
          ))}


          {/* Contact */}
          <div >

            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#E86A2A]">
              Contact
            </h3>


            <ul className="space-y-3 text-sm text-[#D9DED8]">

              <li>
                hello@pageora.com
              </li>

              <li>
                Lagos, Nigeria
              </li>

              <li>
                +234 000 000 0000
              </li>

            </ul>

          </div>


        </div>



        {/* Bottom Footer */}
        <div className="mt-5 border-t border-[#356657] pt-7 text-sm text-[#D9DED8]">

          <p>
            © {new Date().getFullYear()} Pageora. All rights reserved.
          </p>

        </div>


      </div>

    </footer>
  );
};


export default Footer;