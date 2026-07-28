import { cn } from "@/lib/utils";

type InteractiveTextProps = {
  as?: "button" | "span" | "a";
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  "aria-expanded"?: boolean;
  "aria-haspopup"?: boolean | "menu" | "listbox" | "tree" | "grid" | "dialog";
};

export default function InteractiveText({
  as = "span",
  children,
  className,
  onClick,
  type = "button",
  ...aria
}: InteractiveTextProps) {
  const classes = cn(
    "inline-block uppercase transition-all duration-hover ease-editorial",
    "hover:text-red",
    as === "button" && "border-0 bg-transparent p-0",
    className,
  );

  if (as === "button") {
    return (
      <button type={type} className={classes} onClick={onClick} {...aria}>
        {children}
      </button>
    );
  }

  if (as === "a") {
    return (
      <a className={classes} onClick={onClick} {...aria}>
        {children}
      </a>
    );
  }

  return (
    <span className={classes} {...aria}>
      {children}
    </span>
  );
}
