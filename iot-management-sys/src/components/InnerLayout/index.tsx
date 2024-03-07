import { PropsWithChildren } from "react";

const InnerLayout: React.FC<PropsWithChildren> = ({ children }, title) => {
  return (
    <div>
      {title}
      <div>{children}</div>
    </div>
  );
};
export default InnerLayout;
