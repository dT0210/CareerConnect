import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { JOB_TYPES } from "../../../../common/constant";
import { FormatDateTime } from "../../../../common/helpers";
import { createJobRules } from "../../../../common/validations/recruiters";
import { Button } from "../../../../components/Button";
import InputField from "../../../../components/InputField";
import { LoadingSpinner } from "../../../../components/LoadingSpinner";
import { MultipleChoiceDropDown } from "../../../../components/MultipleChoiceDropDown";
import { Select } from "../../../../components/Select";
import { useAuth } from "../../../../hooks";
import { useLoading } from "../../../../hooks/useLoading";
import { editJob, getFields, getJobById, getSkills } from "../../../../services/job";

export const EditJob = () => {
  const { user } = useAuth();
  const {jobId} = useParams();
  const [job, setJob] = useState();
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
  const [errors, setErrors] = useState({});

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
          response.data.map((skill) => ({
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
          response.data.map((skill) => ({
            value: skill.id,
            label: skill.name,
          }))
        );
      })
      .catch((err) => {
        toast.error("Error fetching fields. Check console for more details");
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  
  const fetchJob = async () => {
    setIsLoading(true);
    await getJobById(jobId).then((response) => {
      setJob(response);
      setFormData((prevFormData) => {
        const updatedFormData = { ...prevFormData };
  
        // Iterate over the keys in formData
        Object.keys(prevFormData).forEach((key) => {
          // If the key exists in the response, update the corresponding value in formData
          if (response.hasOwnProperty(key)) {
            updatedFormData[key] = response[key];
          }
        });
        
        return {
          ...updatedFormData, 
          skills: response.skills.map(skill => skill.id),
          fieldId: response.field.id,
          deadline: FormatDateTime(response.deadline, "yyyy-mm-dd")
        };
      });
    }).catch(error => {
      console.log(error);
      toast.error("Trouble fetching job");
    }).finally(()=>{
      setIsLoading(false);
    });
  }

  useEffect(()=>{
  fetchFields();
    fetchSkills();
    fetchJob();
  }, [jobId])
  

  const validateForm = () => {
    const newErrors = {};
    createJobRules.forEach(({ field, validations }) => {
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
    await editJob(jobId, { ...formData, recruiterId: user.id })
      .then(() => {
        toast.success("Company profile updated");
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
        className="w-2/3 my-4 p-4 shadow-lg flex flex-col gap-2"
        onSubmit={handleFormSubmit}
      >
        <div className="text-2xl font-bold text-red-500 mb-4">
          Edit Job
        </div>
        <div className="flex w-full flex-wrap gap-2 justify-between">
          <div className="w-full md:w-[48%]">
            <Select
              options={fields}
              search={true}
              label={"Field"}
              onChange={(option) => {
                setFormData((prevState) => ({
                  ...prevState,
                  fieldId: option?.value,
                }));
              }}
              defaultValue={job?.field.id}
            />
            {errors?.fieldId && (
              <div className="italic text-red-600 text-sm text-right">
                {errors.fieldId}
              </div>
            )}
          </div>
          <div className={"w-full md:w-[48%]"}>
            <Select
              options={JOB_TYPES}
              label={"Type"}
              onChange={(option) => {
                setFormData((prevState) => ({
                  ...prevState,
                  type: option?.value,
                }));
              }}
              defaultValue={job?.type}
            />
            {errors?.type && (
              <div className="italic text-red-600 text-sm text-right">
                {errors.type}
              </div>
            )}
          </div>

          {inputFields.map((field, index) => (
            <div className="w-full md:w-[48%]" key={index}>
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
              />
              {errors[field.name] && (
                <div className="italic text-red-600 text-sm text-right">
                  {errors[field.name]}
                </div>
              )}
            </div>
          ))}
          <div className="w-full md:w-[48%]">
            <MultipleChoiceDropDown
              label="Skills"
              options={skills}
              onChange={(selectedSkills) => {
                setFormData((prev) => ({
                  ...prev,
                  skills: selectedSkills.map((skill) => skill.value),
                }));
              }}
              defaultValues={job?.skills.map(skill => skill.id) || []}
            />
            {errors?.skills && (
              <div className="italic text-red-600 text-sm text-right">
                {errors.skills}
              </div>
            )}
          </div>
          <div className="w-full">
            <InputField
              required={true}
              label={"Description"}
              placeholder={"Enter job description"}
              id={"description"}
              name={"description"}
              value={formData["description"]}
              onChange={handleValueChange}
              type={"textarea"}
            />
            {errors?.description && (
              <div className="italic text-red-600 text-sm text-right">
                {errors.description}
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-center">
          <Button onClick={handleFormSubmit} variant={"red"}>
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};
