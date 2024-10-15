import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createCompanyRules } from "../../../../common/validations/recruiters";
import { Button } from "../../../../components/Button";
import InputField from "../../../../components/InputField";
import { LoadingSpinner } from "../../../../components/LoadingSpinner";
import { useAuth } from "../../../../hooks/useAuth";
import { useLoading } from "../../../../hooks/useLoading";
import { createCompany } from "../../../../services/company";
import { uploadImage } from "../../../../services/file";

export const CreateCompanyProfile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    size: "",
    website: "",
  });
  const [file, setFile] = useState();
  const { isLoading, setIsLoading } = useLoading();
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const validateForm = () => {
    const newErrors = {};
    createCompanyRules.forEach(({ field, validations }) => {
      const value = formData[field];
      for (const validation of validations) {
        if (!validation.validate(value)) {
          newErrors[field] = validation.message;
          break;
        }
      }
    });
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    let imageUrl = "";
    if (file) {
      await uploadImage(file)
        .then(async (response) => {
          imageUrl = response.filePath;
        })
        .catch((error) => {
          toast.error(error.response || "Trouble uploading image file.");
          console.log(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
    await createCompany({ ...formData, recruiterId: user.id, imageUrl })
      .then(() => {
        toast.success("Company profile created.");
        navigate("/recruiters/profile");
      })
      .catch((error) => {
        toast.error(error.response || "Trouble creating company profile.");
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

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="flex items-center justify-center flex-grow">
      <form
        className="w-full sm:w-2/3 lg:w-1/3 my-4 p-4 shadow-lg flex flex-col gap-2"
        onSubmit={handleFormSubmit}
      >
        <div className="text-2xl font-bold text-red-500 mb-4">
          Create company profile
        </div>
        <div>
          <InputField
            label="Company name"
            placeholder="Enter company name"
            id="company-name"
            name="name"
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
            label="Size"
            placeholder="Enter company size"
            id="company-size"
            name="size"
            onChange={handleValueChange}
          />
          {errors?.size && (
            <div className="italic text-red-600 text-sm text-right">
              {errors.size}
            </div>
          )}
        </div>
        <div>
          <InputField
            label="Website"
            placeholder="Enter company website"
            id="company-website"
            name="website"
            onChange={handleValueChange}
          />
          {errors?.website && (
            <div className="italic text-red-600 text-sm text-right">
              {errors.website}
            </div>
          )}
        </div>
        <div>
          <InputField
            label="Address"
            placeholder="Enter company address"
            id="company-address"
            name="address"
            onChange={handleValueChange}
          />
          {errors?.address && (
            <div className="italic text-red-600 text-sm text-right">
              {errors.address}
            </div>
          )}
        </div>
        <div>
          <InputField
            label="Description"
            placeholder="Enter company description"
            id="company-description"
            name="description"
            type={"textarea"}
            onChange={handleValueChange}
          />
          {errors?.description && (
            <div className="italic text-red-600 text-sm text-right">
              {errors.description}
            </div>
          )}
        </div>

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
