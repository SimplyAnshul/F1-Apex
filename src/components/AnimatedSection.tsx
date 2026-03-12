import { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

const AnimatedSection = ({ children, className = "", id }: AnimatedSectionProps) => {
  return (
    <section id={id} className={`gsap-section ${className}`}>
      {children}
    </section>
  );
};

export default AnimatedSection;
