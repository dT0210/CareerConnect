import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../../../components/Button";
import InputField from "../../../components/InputField";
import { LoadingSpinner } from "../../../components/LoadingSpinner";
import { useAuth } from "../../../hooks";
import { getCandidateDetails, updateCandidate } from "../../../services/candidate";

function Profile() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  const fetchUser = () => {
    setLoading(true);
    getCandidateDetails(user.id)
      .then((response) => {
        setFormData(response);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUser();
  }, [user.id]);

  const handleValueChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    updateCandidate(user.id, formData).then(()=>{
      toast.success("Update profile successfully");
    }).catch((error)=>{
      toast.error(error);
      console.log(error);
    }).finally(()=>{
      setLoading(false);
    });
  };

  return (
    <div className="flex flex-grow p-8 justify-center">
      <div className="w-2/3 md:w-[50%] p-4 shadow-lg">
        <div className="font-bold text-2xl">Personal Information</div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <form className="mt-4 flex flex-col gap-2" onSubmit={handleSubmit}>
            <InputField
              name={"name"}
              label={"Name"}
              placeholder={"Enter your name"}
              value={formData.name}
              onChange={handleValueChange}
            />
            <InputField
              name={"phoneNumber"}
              label={"Phone Number"}
              placeholder={"Enter your phone number"}
              value={formData.phoneNumber}
              onChange={handleValueChange}
            />
            <InputField
              name={"address"}
              label={"Address"}
              placeholder={"Enter your address"}
              value={formData.address}
              onChange={handleValueChange}
            />
            <InputField
              name={"email"}
              label={"Email"}
              value={formData.email}
              disabled
            />

            <div className="flex justify-center mt-4 gap-2">
              <Button variant={"red"}>Save</Button>
              <Button>Cancel</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Profile;
