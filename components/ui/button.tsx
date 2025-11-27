import React from "react";

export const Button = ({ className, variant = "default", size = "default", asChild, ...props }: any) => {
  const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  const variants: any = {
    default: "bg-gray-900 text-white hover:bg-gray-800",
    destructive: "bg-red-500 text-white hover:bg-red-600",
    outline: "border border-gray-200 bg-white hover:bg-gray-100 text-gray-900",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    ghost: "hover:bg-gray-100 text-gray-900",
    link: "text-blue-600 underline-offset-4 hover:underline",
  };
  const sizes: any = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };

  const combinedClassName = `${baseStyles} ${variants[variant] || variants.default} ${sizes[size] || sizes.default} ${className || ""}`;

  if (asChild) {
    return React.Children.map(props.children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          className: `${combinedClassName} ${(child.props as any).className || ""}`,
          ...props, // Pass down other props like onClick
        } as any);
      }
      return child;
    });
  }

  return (
    <button className={combinedClassName} {...props} />
  );
};