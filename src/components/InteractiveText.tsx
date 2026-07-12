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
    "inline-block uppercase text-[11px] tracking-[0.2em] text-white transition-all duration-hover ease-editorial md:text-[12px]",
    "hover:text-red hover:tracking-[0.28em]",
    as === "button" && "bg-transparent border-0 p-0",
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
    <span className={classes} onClick={onClick} {...aria}>
      {children}
    </span>
  );
}
