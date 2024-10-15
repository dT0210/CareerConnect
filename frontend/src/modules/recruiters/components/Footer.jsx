import { FaPhone } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className=" w-full bg-[#ef4545] p-10">
      <div className="flex text-white  gap-20">
        <div>
          <div className="font-bold text-xl">About</div>
          <div>
            <Link className="block hover:underline">Our services</Link>
            <Link className="block hover:underline">Private Policy</Link>
            <Link className="block hover:underline">Terms & Conditions</Link>
          </div>
        </div>
        <div>
          <div className="font-bold text-xl">Contact</div>
          <div>
            <Link className="flex gap-1 items-center hover:underline">
              <FaPhone />
              0377628417
            </Link>
            <Link className="flex gap-1 items-center hover:underline">
              <IoIosMail size={18}/>
              hr@career.com
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
