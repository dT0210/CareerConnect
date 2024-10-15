import { AuthRequired } from "../components/AuthRequired";
import Footer from "../components/Footer";
import { Nav } from "../components/Nav";

const Layout = ({ children }) => {
  return (
    <div className="h-full flex flex-col">
      <AuthRequired>
        <Nav />
        {children}
        <Footer/>
      </AuthRequired>
    </div>
  );
};

export default Layout;
