import { AuthRequired } from "../components/AuthRequired";
import { Nav } from "../components/Nav";

const Layout = ({ children }) => {
  return (
    <div className="h-full flex flex-col">
      <AuthRequired>
        <Nav />
        {children}
      </AuthRequired>
    </div>
  );
};

export default Layout;
