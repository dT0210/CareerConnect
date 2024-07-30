import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import background from "../../../assets/images/Group 13.png";
import InputField from "../../../components/InputField";
import { useLoading } from "../../../hooks/useLoading";
import { candidateRegister } from "../../../services/candidate";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    password: "",
    confirmPassword: "",
  });
  const {isLoading, setIsLoading} = useLoading();

  const handleValueChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const navigate = useNavigate();

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    candidateRegister(formData)
      .then((response) => {
        toast.success("Sign up successfully!");
        navigate("/signin/candidates");
      })
      .catch((error) => {
        console.error(error);
      }).finally(() => {
        setIsLoading(false);
      });
  };

  if (isLoading) return (<LoadingSpinner/>);

  return (
    <div className="bg-gradient-to-b from-[#DBE2DA] to-[#E4EBE3] relative w-[100vw] h-[100vh] -z-0">
      <div className="absolute w-full h-full top-0 right-0 flex justify-end -z-10">
        <img src={background} alt="" className="object-cover" />
      </div>
      <div className="w-full h-full z-10 flex justify-center items-center">
        <form
          onSubmit={handleFormSubmit}
          className="bg-white w-[50%] min-h-[80%] h-fit rounded-2xl relative"
        >
          <div className="absolute rounded-t-2xl bg-[#FF4545] w-full h-[74px] flex justify-center items-center text-white font-extrabold text-3xl">
            SIGN UP
          </div>
          <div className="p-8 mt-[74px]">
            <div className="flex gap-4 flex-wrap justify-between">
              <div className="flex flex-col gap-4 w-full lg:w-[45%]">
                <InputField
                  required={true}
                  type="name"
                  name="name"
                  id="name"
                  value={formData.name}
                  label="Full Name"
                  placeholder="Enter full name"
                  onChange={handleValueChange}
                />
                <InputField
                  required={true}
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  label="Email"
                  placeholder="Enter email"
                  onChange={handleValueChange}
                />
                <InputField
                  required={true}
                  name="phoneNumber"
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  label="Phone number"
                  placeholder="Enter phone number"
                  onChange={handleValueChange}
                />
                <InputField
                  required={true}
                  name="address"
                  id="address"
                  value={formData.address}
                  label="Address"
                  placeholder="Enter address"
                  onChange={handleValueChange}
                />
              </div>
              <div className="flex flex-col gap-4 w-full lg:w-[45%]">
                <InputField
                  required={true}
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  label="Password"
                  placeholder="Enter password"
                  onChange={handleValueChange}
                />
                <InputField
                  required={true}
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  label="Confirm password"
                  placeholder="Enter password"
                  onChange={handleValueChange}
                />
                <div>
                  <div>
                    Already have an account?&nbsp;
                    <Link
                      to="/signin/candidates"
                      className="text-blue-400 underline"
                    >
                      Sign in
                    </Link>
                  </div>
                  <div>
                    Sign up for{" "}
                    <Link
                      to="/signup/recruiters"
                      className="text-blue-400 underline"
                    >
                      recruiters
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <button className="mx-auto block bg-[#FF4545] text-white mt-[32px] rounded-lg px-6 py-3">
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
