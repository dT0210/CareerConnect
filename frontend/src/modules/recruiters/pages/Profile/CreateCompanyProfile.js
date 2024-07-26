import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../../../../components/Button";
import InputField from "../../../../components/InputField";
import { useAuth } from "../../../../hooks/useAuth";
import { createCompany } from "../../../../services/recruiter";

export const CreateCompanyProfile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    size: "",
    website: "",
  });

  const navigate = useNavigate();

  const handleFormSubmit = (event) => {
    console.log(user);
    event.preventDefault();
    createCompany({ ...formData, recruiterId: user.id })
      .then(() => {
        toast.success("Company profile created.");
        navigate("/recruiters/dashboard");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleValueChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="flex items-center justify-center">
      <form
        className="w-1/3 mt-16 p-4 shadow-lg flex flex-col gap-2"
        onSubmit={handleFormSubmit}
      >
        <div className="text-2xl font-bold text-[#ff4545] mb-4">
          Create company profile
        </div>
        <InputField
          label="Company name"
          placeholder="Enter company name"
          id="company-name"
          name="name"
          onChange={handleValueChange}
        />
        <InputField
          label="Size"
          placeholder="Enter company size"
          id="company-size"
          name="size"
          onChange={handleValueChange}
        />
        <InputField
          label="Website"
          placeholder="Enter company website"
          id="company-website"
          name="website"
          onChange={handleValueChange}
        />
        <InputField
          label="Description"
          placeholder="Enter company description"
          id="company-description"
          name="description"
          onChange={handleValueChange}
        />
        <Button>Create</Button>
      </form>
    </div>
  );
};
