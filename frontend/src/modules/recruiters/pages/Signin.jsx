import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import background from "../../../assets/images/Group 13.png";
import { emailRegex } from "../../../common/validations/index";
import InputField from "../../../components/InputField";
import { LoadingSpinner } from "../../../components/LoadingSpinner";
import { useAuth } from "../../../hooks/useAuth";
import { useLoading } from "../../../hooks/useLoading";
import { recruiterLogin } from "../../../services/recruiter";

const Signin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState();
  const {isLoading, setIsLoading} = useLoading();

  const handleValueChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const navigate = useNavigate();
  const {setIsAuthenticated, fetchUserFromToken} = useAuth();

  const validateForm = () => {
    if (formData.email === "") {
      setError("Please enter your email");
      return false;
    }
    if (formData.password === "") {
      setError("Please enter your password");
      return false;
    }
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email");
      return false;
    }
    setError();
    return true;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    await recruiterLogin(formData)
      .then((response) => {
        if (response.success) {
          localStorage.setItem("token", response.token);
          setIsAuthenticated(true);
          fetchUserFromToken();
          toast.success("Signed in.");
          navigate("/recruiters/dashboard");
        }
      })
      .catch((err) => {
        console.log(err);
        setError(err.message);
      }).finally(() => {
        setIsLoading(false);
      });
  };

  if (isLoading) return (<LoadingSpinner/>)

  return (
    <div className="bg-gradient-to-b from-[#DBE2DA] to-[#E4EBE3] relative w-[100vw] h-[100vh] -z-0">
      <div className="absolute w-full h-full top-0 right-0 flex justify-end -z-10">
        <img src={background} alt="" className="object-cover" />
      </div>
      <div className="w-full h-full z-10 flex justify-center items-center">
        <form
          className="bg-white w-full md:w-[50%] min-h-[60%] h-fit rounded-2xl relative"
          onSubmit={handleSubmit}
        >
          <div className="absolute rounded-t-2xl bg-red-500 w-full h-[74px] flex justify-center items-center text-white font-extrabold text-3xl">
            SIGN IN
          </div>
          <div className="p-8 mt-[74px]">
            <div className="flex gap-10 flex-wrap sm:flex-nowrap w-full">
              <div className="flex flex-col gap-4 w-[50%]">
                <InputField
                  required={true}
                  name="email"
                  id="email"
                  value={formData.email}
                  label="Email"
                  placeholder="Enter email"
                  onChange={handleValueChange}
                />
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
                {error && (
                  <div className="italic text-red-600 text-sm text-right">
                    {error}
                  </div>
                )}
                <div className="">
                  <div>
                  Don't have an account?&nbsp;
                  <Link
                    to="/signup/recruiters"
                    className="text-blue-400 underline"
                  >
                    Sign up
                  </Link>
                  </div>
                  <div>
                  Sign in for&nbsp;
                  <Link
                    to="/signin/candidates"
                    className="text-blue-400 underline"
                  >
                    candidates
                  </Link>
                  </div>
                </div>
              </div>
              <div className="text-wrap w-[50%]">
                <div className="font-bold text-2xl">WELCOME BACK!</div>
                <div className="text-lg italic">
                  Create advantages for your business by finding the best
                  candidates
                </div>
              </div>
            </div>
            <button className="mx-auto block bg-red-500 text-white mt-[32px] rounded-lg px-6 py-3">
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signin;
