import { useState } from "react";
import InputField from "../../../../components/InputField";

export const CreateCompanyProfile = () => {
    const formData = useState({
        name: "",
        description: "",
        size: "",
        website: ""
    });

    const handleFormSubmit = (event) => {
        event.preventDefault();
        
    }   
    
    return (
        <div className="flex items-center justify-center">
            <form className="w-1/3 mt-16 p-4 shadow-lg flex flex-col gap-2" onSubmit={handleFormSubmit}>
                <div className="text-2xl font-bold text-[#ff4545] mb-4">
                    Create company profile
                </div>
                <InputField
                    label="Company name"
                    placeholder="Enter company name"
                    id="company-name"
                    name="company-name"
                />
                <InputField
                    label="Size"
                    placeholder="Enter company size"
                    id="company-size"
                    name="compant-size"
                />
                <InputField
                    label="Website"
                    placeholder="Enter company website"
                    id="company-website"
                    name="compant-website"
                />
                <InputField
                    label="Description"
                    placeholder="Enter company description"
                    id="company-description"
                    name="compant-description"
                />
            </form>
            
        </div>
    )
}