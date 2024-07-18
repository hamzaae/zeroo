import { Button } from "./ui/button";

export const Cta = () => {
  return (
    <section
      id="cta"
      className="bg-muted/50 py-16 my-24 sm:my-32"
    >
      <div className="container lg:grid lg:grid-cols-2 place-items-center">
        <div className="lg:col-start-1">
          <h2 className="text-3xl md:text-4xl font-bold ">
            Start now
            <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
              {" "}
              Validating Your Exams{" "}
            </span>
            with ZeroRatt
          </h2>
          <p className="text-muted-foreground text-xl mt-4 mb-8 lg:mb-0">
            What are you waiting for? Start now and validate your exams with
            ZeroRatt platform.
          </p>
        </div>

        <div className="space-y-4 lg:col-start-2">
          <a href="/start"><Button className="w-full md:mr-4 md:w-auto">Start</Button></a>
          <a href="#faq">
            <Button
            variant="outline"
            className="w-full md:w-auto"
          >
            Still have questions?
          </Button>
          </a>
        </div>
      </div>
    </section>
  );
};
