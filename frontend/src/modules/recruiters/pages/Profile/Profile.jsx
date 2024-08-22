import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { COMPANY_STATUS } from "../../../../common/constant";
import { Button } from "../../../../components/Button";
import { LoadingSpinner } from "../../../../components/LoadingSpinner";
import { useAuth } from "../../../../hooks";
import { useLoading } from "../../../../hooks/useLoading";
import { getRecruiter } from "../../../../services/recruiter";

export const Profile = () => {
  const { user } = useAuth();
  const [recruiter, setRecruiter] = useState(null);
  const navigate = useNavigate();
  const {isLoading, setIsLoading} = useLoading();

  const fetchRecruiter = async () => {
    setIsLoading(true);
    await getRecruiter(user.id)
      .then((response) => {
        setRecruiter(response);
      })
      .catch((err) => {
        console.log(err);
      }).finally(()=>{
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (user.id) fetchRecruiter();
  }, [user]);

  if (isLoading) return (<LoadingSpinner/>)

  return (
    <div className="p-8">
      <div>
        <div className="text-2xl font-bold mb-2">Personal Information</div>
        <div>
          <table className="w-[400px]">
            <tbody>
              <tr>
                <td>Name</td>
                <td>{recruiter?.name}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{recruiter?.email}</td>
              </tr>
              <tr>
                <td>Phone number</td>
                <td>{recruiter?.phoneNumber}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-4">
        <div className="mb-2 flex items-end">
          <div className="text-2xl font-bold">Company Profile</div>
          {recruiter?.company && (
            <div className="ml-2">
              <Link
                to={`company/edit/${recruiter.company.id}`}
                className="text-blue-600 underline"
              >
                Edit
              </Link>
            </div>
          )}
        </div>

        <div>
          {recruiter?.company ? (
            <div>
              <table className="w-[400px]">
                <tbody>
                  <tr>
                    <td>Name</td>
                    <td>{recruiter?.company.name}</td>
                  </tr>
                  <tr>
                    <td>Size</td>
                    <td>{recruiter?.company.size}</td>
                  </tr>
                  <tr>
                    <td>Website</td>
                    <td>
                      <a
                        href={
                          recruiter?.company.website.startsWith("http://") ||
                          recruiter?.company.website.startsWith("https://")
                            ? recruiter?.company.website
                            : `https://${recruiter?.company.website}`
                        }
                        target="_blank"
                        className="text-blue-600 underline"
                      >
                        {recruiter?.company.website}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td>Status</td>
                    <td>
                      {
                        COMPANY_STATUS.find(
                          (status) => recruiter?.company.status === status.value
                        )?.label
                      }
                    </td>
                  </tr>
                </tbody>
              </table>
              <div>
                <img src={recruiter?.company.imageUrl} alt="No image" className="h-24"/>
              </div>
            </div>
          ) : (
            <div>
              <Button
                variant={"red"}
                onClick={() => navigate("/recruiters/profile/company/create")}
              >
                Create a Company profile
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
