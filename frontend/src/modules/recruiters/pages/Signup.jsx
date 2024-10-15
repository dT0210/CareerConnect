import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import background from "../../../assets/images/Group 13.png";
import { recruitersSignUpRules } from "../../../common/validations/recruiters";
import InputField from "../../../components/InputField";
import { LoadingSpinner } from "../../../components/LoadingSpinner";
import { useLoading } from "../../../hooks/useLoading";
import { recruiterRegister } from "../../../services/recruiter";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const { isLoading, setIsLoading } = useLoading();
  const [errors, setErrors] = useState({});

  const handleValueChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    // setErrors();
    const newErrors = {};

    recruitersSignUpRules.forEach(({ field, validations }) => {
      const value = formData[field];
      for (const validation of validations) {
        if (!validation.validate(value, formData)) {
          newErrors[field] = validation.message;
          break; // Stop at the first failed validation
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const navigate = useNavigate();

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    await recruiterRegister(formData)
      .then((response) => {
        toast.success("Sign up successfully!");
        navigate("/signin/recruiters");
      })
      .catch((error) => {
        toast.error(error.response.data);
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="bg-gradient-to-b from-[#DBE2DA] to-[#E4EBE3] relative w-[100vw] h-[100vh] -z-0">
      <div className="absolute w-full h-full top-0 right-0 flex justify-end -z-10">
        <img src={background} alt="" className="object-cover" />
      </div>
      <div className="w-full h-full z-10 flex justify-center md:items-center">
        <form
          onSubmit={handleFormSubmit}
          className="bg-white  md:mt-0 w-full md:w-[80%] lg:w-[50%] h-fit rounded-2xl relative"
        >
          <div className="absolute rounded-t-2xl bg-red-500 w-full h-[74px] flex justify-center items-center text-white font-extrabold text-3xl">
            SIGN UP
          </div>
          <div className="p-8 mt-[74px]">
            <div className="flex gap-4 flex-wrap justify-between">
              <div className="flex flex-col gap-4 w-full md:w-[45%]">
                <div>
                  <InputField
                    name="name"
                    id="name"
                    value={formData.name}
                    label="Full Name"
                    placeholder="Enter full name"
                    onChange={handleValueChange}
                  />
                  {errors?.name && (
                    <div className="italic text-red-600 text-sm text-right">
                      {errors.name}
                    </div>
                  )}
                </div>
                <div>
                  <InputField
                    name="email"
                    id="email"
                    value={formData.email}
                    label="Email"
                    placeholder="Enter email"
                    onChange={handleValueChange}
                  />
                  {errors?.email && (
                    <div className="italic text-red-600 text-sm text-right">
                      {errors.email}
                    </div>
                  )}
                </div>
                <div>
                  <InputField
                    name="phoneNumber"
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    label="Phone number"
                    placeholder="Enter phone number"
                    onChange={handleValueChange}
                  />
                  {errors?.phoneNumber && (
                    <div className="italic text-red-600 text-sm text-right">
                      {errors.phoneNumber}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-4 w-full md:w-[45%]">
                <div>
                  <InputField
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    label="Password"
                    placeholder="Enter password"
                    onChange={handleValueChange}
                  />
                  {errors?.password && (
                    <div className="italic text-red-600 text-sm text-right">
                      {errors.password}
                    </div>
                  )}
                </div>
                <div>
                  <InputField
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    label="Confirm password"
                    placeholder="Enter password"
                    onChange={handleValueChange}
                  />
                  {errors?.confirmPassword && (
                    <div className="italic text-red-600 text-sm text-right">
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>

                <div>
                  <div>
                    Already have an account?&nbsp;
                    <Link
                      to="/signin/recruiters"
                      className="text-blue-400 underline"
                    >
                      Sign in
                    </Link>
                  </div>
                  <div>
                    Signup for&nbsp;
                    <Link
                      to="/signup/candidates"
                      className="text-blue-400 underline"
                    >
                      candidates
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <button className="mx-auto block bg-red-500 text-white mt-[32px] rounded-lg px-6 py-3">
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
