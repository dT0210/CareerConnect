import { Nav } from "../components/Nav";

const Layout = ({children}) => {
    return (
        <div className="h-full flex flex-col">
            <Nav/>
            {children}
        </div>
    );
};

export default Layout