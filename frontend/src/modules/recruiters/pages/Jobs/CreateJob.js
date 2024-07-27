import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { JOB_TYPE } from "../../../../common/constant";
import { Button } from "../../../../components/Button";
import InputField from "../../../../components/InputField";
import { MultipleChoiceInputField } from "../../../../components/MultipleChoiceInputField";
import { useAuth } from "../../../../hooks";
import { createJob, getSkills } from "../../../../services/job";

export const CreateJob = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    field: "",
    salary: "",
    experience: "",
    deadline: "",
    type: 5,
    skills: []
  });
  const [skills, setSkills] = useState([]);
  const navigate = useNavigate();

  const inputFields = [
    { label: "Job Title", placeholder: "Enter job title", name: "title" },
    
    { label: "Location", placeholder: "Enter location", name: "location" },
    { label: "Field", placeholder: "Enter field", name: "field" },
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
    {
        label: "Description",
        placeholder: "Enter job description",
        name: "description",
        type: "textarea"
      },
  ];

  useEffect(()=>{
    getSkills().then((response)=>{
        setSkills(response);
    }).catch((err)=>{
        toast.error("Error fetching skills. Check console for more details");
        console.log(err)
    })
  }, [])

  const handleFormSubmit = (event) => {
    event.preventDefault();
    createJob({ ...formData, recruiterId: user.id })
      .then(() => {
        toast.success("Company profile created.");
        navigate("/recruiters/profile");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleValueChange = (e) => {
    const { name, value, localName } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: localName === "select" ? parseInt(value): value,
    }));
  };


  return (
    <div className="flex items-center justify-center">
      <form
        className="w-2/3 mt-16 p-4 shadow-lg flex flex-col gap-2"
        onSubmit={handleFormSubmit}
      >
        <div className="text-2xl font-bold text-[#ff4545] mb-4">
          Create new job
        </div>
        <div className="flex w-full flex-wrap gap-2">
          {inputFields.map((field) => (
            <InputField
                required={true}
              key={field.name}
              label={field.label}
              placeholder={field.placeholder}
              id={field.name}
              name={field.name}
              value={formData[field.name]}
              onChange={handleValueChange}
              type={field.type}
              className="w-[48%]"
            />
          ))}
          <select
            name="type"
            id="type"
            className="bg-slate-200 p-2 w-[48%] focus:outline-none h-fit"
            onChange={handleValueChange}
          >
            <option value="" disabled>
              Type
            </option>
            {JOB_TYPE.map((type) => (
              <option value={type.value}>{type.label}</option>
            ))}
          </select>
          <MultipleChoiceInputField
            label="Skills"
            options={skills}
          />
        </div>
        <div className="flex justify-center">
          <Button onClick={handleFormSubmit}>Create</Button>
        </div>
      </form>
    </div>
  );
};
