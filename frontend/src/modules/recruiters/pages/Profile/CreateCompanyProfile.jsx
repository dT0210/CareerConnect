import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../../../../components/Button";
import InputField from "../../../../components/InputField";
import { LoadingSpinner } from "../../../../components/LoadingSpinner";
import { useAuth } from "../../../../hooks/useAuth";
import { useLoading } from "../../../../hooks/useLoading";
import { uploadImage } from "../../../../services/image";
import { createCompany } from "../../../../services/recruiter";

export const CreateCompanyProfile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    size: "",
    website: "",
  });
  const [file, setFile] = useState();
  const { isLoading, setIsLoading } = useLoading();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    if (file) {
      await uploadImage(file)
        .then(async (response) => {
          const imageUrl = response.filePath;
          await createCompany({ ...formData, recruiterId: user.id, imageUrl })
            .then(() => {
              toast.success("Company profile created.");
              navigate("/recruiters/profile");
            })
            .catch((error) => {
              toast.error("Error creating company profile.");
              console.log(error);
            });
        })
        .catch((err) => {
          toast.error("Error uploading image file.");
          console.log(err);
        }).finally(()=>{
          setIsLoading(false);
        });
    }
  };

  const handleValueChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  if (isLoading) return <LoadingSpinner />;

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
        <InputField
          label="Image"
          id="company-image"
          name="image"
          type="file"
          onChange={handleFileChange}
        />
        <Button>Create</Button>
      </form>
    </div>
  );
};
