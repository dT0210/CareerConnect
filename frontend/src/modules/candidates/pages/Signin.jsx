import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import background from "../../../assets/images/Group 13.png";
import InputField from "../../../components/InputField";
import { LoadingSpinner } from "../../../components/LoadingSpinner";
import { useAuth } from "../../../hooks/useAuth";
import { useLoading } from "../../../hooks/useLoading";
import { candidateLogin } from "../../../services/candidate";

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    await candidateLogin(formData)
      .then((response) => {
        console.log(response);
        if (response.success) {
          localStorage.setItem("token", response.token);
          setIsAuthenticated(true);
          fetchUserFromToken();
          toast.success("Signed in.");
          navigate("/dashboard");
        }
      })
      .catch((err) => {
        console.log(err.response);
        setError(err.response.data.message);
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
          className="bg-white w-full md:w-[50%] min-h-[60%] h-fit rounded-2xl relative"
          onSubmit={handleSubmit}
        >
          <div className="absolute rounded-t-2xl bg-red-500 w-full h-[74px] flex justify-center items-center text-white font-extrabold text-3xl">
            SIGN IN
          </div>
          <div className="p-8 mt-[74px]">
            <div className="flex gap-10 flex-wrap sm:flex-nowrap">
              <div className="flex flex-col gap-4 w-[50%]">
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
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  label="Password"
                  placeholder="Enter password"
                  onChange={handleValueChange}
                />
                {error && <div className="italic text-red-600 text-sm text-right">
                  {error}
                </div>}
                <div>
                  <div>
                  Don't have an account?&nbsp;
                  <Link
                    to="/signup/candidates"
                    className="text-blue-400 underline"
                  >
                    Sign up
                  </Link>
                  </div>
                  <div>
                  Sign in for&nbsp;
                  <Link
                    to="/signin/recruiters"
                    className="text-blue-400 underline"
                  >
                    recruiters
                  </Link>
                  </div>
                </div>
              </div>
              <div className="w-[45%]">
                <div className="text-wrap">
                  <div className="font-bold text-2xl">WELCOME BACK!</div>
                  <div className="text-lg italic">
                  Let’s build a impressive profile and discover new career oppotunities
                  </div>
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
