import { BookOpenCheck } from "lucide-react";

export const Footer = () => {
  return (
    <footer id="footer">
      <hr className="w-11/12 mx-auto" />

      <section className="container pt-8 pb-8 text-center">
        <h3>
          &copy; ZeroRatt made by{" "}
          <a
            rel="noreferrer noopener"
            target="_blank"
            href="https://github.com/hamzaae"
            className="text-primary transition-all border-primary hover:border-b-2"
          >
            Hamzaae
          </a>
        </h3>
      </section>
    </footer>
  );
};
