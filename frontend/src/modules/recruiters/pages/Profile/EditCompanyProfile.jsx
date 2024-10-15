import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../../../../components/Button";
import InputField from "../../../../components/InputField";
import { LoadingSpinner } from "../../../../components/LoadingSpinner";
import { useAuth } from "../../../../hooks/useAuth";
import { useLoading } from "../../../../hooks/useLoading";
import { editCompany, getCompanyProfile } from "../../../../services/company";
import { uploadImage } from "../../../../services/file";

export const EditCompanyProfile = () => {
  const { companyId } = useParams();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    size: "",
    website: "",
    imageUrl: "",
  });
  const { isLoading, setIsLoading } = useLoading();
  const navigate = useNavigate();
  const [file, setFile] = useState();
  const [errors, setErrors] = useState({});

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
    let imageUrl = formData.imageUrl;
    if (file) {
      await uploadImage(file)
        .then((response) => {
          console.log(response);
          imageUrl = response.filePath;
        })
        .catch((err) => {
          console.log(err);
          toast.error("Error uploading image file.");
        });
    }

    await editCompany(companyId, {
      ...formData,
      recruiterId: user.id,
      imageUrl,
    })
      .then(() => {
        toast.success("Company profile updated.");
        navigate("/recruiters/profile");
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleValueChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const fetchCompanyProfile = async () => {
    setIsLoading(true);
    await getCompanyProfile(companyId)
      .then((response) => {
        setFormData({
          name: response.name,
          description: response.description,
          size: response.size,
          website: response.website,
          imageUrl: response.imageUrl,
          address: response.address,
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error fetching company. Check the console for details.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchCompanyProfile();
  }, [companyId]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="flex items-center justify-center flex-grow">
      <form
        className="w-1/3 my-4 p-4 shadow-lg flex flex-col gap-2"
        onSubmit={handleFormSubmit}
      >
        <div className="text-2xl font-bold text-red-500 mb-4">
          Update company profile
        </div>
        <div>
          <InputField
            label="Company name"
            placeholder="Enter company name"
            id="company-name"
            name="name"
            onChange={handleValueChange}
            value={formData.name}
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
            value={formData.size}
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
            value={formData.website}
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
            value={formData.address}
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
            onChange={handleValueChange}
            value={formData.description}
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
        <Button>Update</Button>
      </form>
    </div>
  );
};
