import Footer from "../components/Footer";
import { Nav } from "../components/Nav";

const Layout = ({ children }) => {
  return (
    <div className="h-full flex flex-col">
      <Nav />
      {children}
      <Footer/>
    </div>
  );
};

export default Layout;
