import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { JOB_TYPES } from "../../../../common/constant";
import { Button } from "../../../../components/Button";
import InputField from "../../../../components/InputField";
import { LoadingSpinner } from "../../../../components/LoadingSpinner";
import { MultipleChoiceDropDown } from "../../../../components/MultipleChoiceDropDown";
import { Select } from "../../../../components/Select";
import { useAuth } from "../../../../hooks";
import { useLoading } from "../../../../hooks/useLoading";
import { createJob, getFields, getSkills } from "../../../../services/job";

export const CreateJob = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    fieldId: "",
    salary: "",
    experience: "",
    deadline: "",
    type: 5,
    skills: [],
  });
  const [skills, setSkills] = useState([]);
  const [fields, setFields] = useState([]);
  const navigate = useNavigate();
  const { isLoading, setIsLoading } = useLoading();

  const {} = useForm({
    title: "",
    description: "",
    location: "",
    fieldId: "",
    salary: "",
    experience: "",
    deadline: "",
    type: 5,
    skills: [],
  });

  const inputFields = [
    { label: "Job Title", placeholder: "Enter job title", name: "title" },

    { label: "Location", placeholder: "Enter location", name: "location" },
    { label: "Salary", placeholder: "Enter salary", name: "salary" },
    {
      label: "Experience",
      placeholder: "Enter experience",
      name: "experience",
    },
    {
      label: "Deadline",
      placeholder: "Enter deadline",
      name: "deadline",
      type: "date",
    },
  ];

  const fetchSkills = async () => {
    setIsLoading(true);
    await getSkills()
      .then((response) => {
        setSkills(
          response.map((skill) => ({
            value: skill.id,
            label: skill.name,
          }))
        );
      })
      .catch((err) => {
        toast.error("Error fetching skills. Check console for more details");
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const fetchFields = async () => {
    setIsLoading(true);
    await getFields()
      .then((response) => {
        setFields(
          response.map((skill) => ({
            value: skill.id,
            label: skill.name,
          }))
        );
      })
      .catch((err) => {
        toast.error("Error fetching skills. Check console for more details");
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchFields();
    fetchSkills();
  }, []);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    await createJob({ ...formData, recruiterId: user.id })
      .then(() => {
        toast.success("Company profile created.");
        navigate("/recruiters/jobs");
      })
      .catch((error) => {
        toast.error(error.response.data);
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleValueChange = (e) => {
    const { name, value, localName } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: localName === "select" ? parseInt(value) : value,
    }));
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="flex items-center justify-center">
      <form
        className="w-2/3 mt-16 p-4 shadow-lg flex flex-col gap-2"
        onSubmit={handleFormSubmit}
      >
        <div className="text-2xl font-bold text-red-500 mb-4">
          Create new job
        </div>
        <div className="flex w-full flex-wrap gap-2 justify-between">
          <Select
            options={fields}
            search={true}
            label={"Field"}
            onChange={(option) => {
              setFormData((prevState) => ({
                ...prevState,
                fieldId: option.value,
              }));
            }}
            className={"w-full md:w-[48%]"}
          />
          <Select
            options={JOB_TYPES}
            label={"Type"}
            onChange={(option) => {
              setFormData((prevState) => ({
                ...prevState,
                type: option.value,
              }));
            }}
            className={"w-full md:w-[48%]"}
          />
          {inputFields.map((field, index) => (
            <InputField
              required={true}
              key={index}
              label={field.label}
              placeholder={field.placeholder}
              id={field.name}
              name={field.name}
              value={formData[field.name]}
              onChange={handleValueChange}
              type={field.type}
              className="w-full md:w-[48%]"
            />
          ))}
          <MultipleChoiceDropDown
            label="Skills"
            options={skills}
            onChange={(selectedSkills) => {
              setFormData((prev) => ({
                ...prev,
                skills: selectedSkills.map((skill) => skill.value),
              }));
            }}
            className={"w-full md:w-[48%]"}
          />
          <InputField
              required={true}
              label={"Description"}
              placeholder={"Enter job decription"}
              id={"description"}
              name={"description"}
              value={formData["description"]}
              onChange={handleValueChange}
              type={"textarea"}
              className="w-full"
            />
        </div>
        <div className="flex justify-center">
          <Button onClick={handleFormSubmit} variant={"red"}>
            Create
          </Button>
        </div>
      </form>
    </div>
  );
};
