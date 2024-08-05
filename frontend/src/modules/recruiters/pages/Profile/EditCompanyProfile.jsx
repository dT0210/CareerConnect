import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../../../../components/Button";
import InputField from "../../../../components/InputField";
import { LoadingSpinner } from "../../../../components/LoadingSpinner";
import { useAuth } from "../../../../hooks/useAuth";
import { useLoading } from "../../../../hooks/useLoading";
import { uploadImage } from "../../../../services/image";
import { editCompany, getCompanyProfile } from "../../../../services/recruiter";

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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
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
          address: response.address
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
    <div className="flex items-center justify-center">
      <form
        className="w-1/3 mt-16 p-4 shadow-lg flex flex-col gap-2"
        onSubmit={handleFormSubmit}
      >
        <div className="text-2xl font-bold text-red-500 mb-4">
          Create company profile
        </div>
        <InputField
          label="Company name"
          placeholder="Enter company name"
          id="company-name"
          name="name"
          onChange={handleValueChange}
          value={formData.name}
        />
        <InputField
          label="Size"
          placeholder="Enter company size"
          id="company-size"
          name="size"
          onChange={handleValueChange}
          value={formData.size}
        />
        <InputField
          label="Website"
          placeholder="Enter company website"
          id="company-website"
          name="website"
          onChange={handleValueChange}
          value={formData.website}
        />
        <InputField
          label="Address"
          placeholder="Enter company address"
          id="company-address"
          name="address"
          onChange={handleValueChange}
          value={formData.address}
        />
        <InputField
          label="Description"
          placeholder="Enter company description"
          id="company-description"
          name="description"
          onChange={handleValueChange}
          value={formData.description}
        />
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
