import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { MedalIcon, MapIcon, PlaneIcon, GiftIcon } from "../components/Icons";
import { Dumbbell, PencilLine, Share, Upload } from "lucide-react";

interface FeatureProps {
  icon: JSX.Element;
  title: string;
  description: string;
}

const features: FeatureProps[] = [
  {
    icon: <Upload className="text-green-300 w-12 h-12"/>,
    title: "Upload",
    description:
      "Choose the right content you want and upload your file",
  },
  {
    icon: <PencilLine  className="text-green-300 w-12 h-12"/>,
    title: "Create",
    description:
      "Click on create and wait for ZeroRatt to create your quiz",
  },
  {
    icon: <Dumbbell className="text-green-300 w-12 h-12" />,
    title: "Answer",
    description:
      "Answer the quiz and check your comprehension",
  },
  {
    icon: <Share className="text-green-300 w-12 h-12" />,
    title: "Share",
    description:
      "Retry, Download & Share your quiz with your friends",
  },
];

export const HowItWorks = () => {
  return (
    <section
      id="howItWorks"
      className="container text-center py-24 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold ">
        How It{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Works{" "}
        </span>
        Step-by-Step Guide
      </h2>
      <p className="md:w-3/4 mx-auto mt-4 mb-8 text-xl text-muted-foreground">
        How to use ZeroRatt to get your quiz
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map(({ icon, title, description }: FeatureProps) => (
          <Card
            key={title}
            className="bg-muted/50"
          >
            <CardHeader>
              <CardTitle className="grid gap-4 place-items-center">
                {icon}
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent>{description}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
