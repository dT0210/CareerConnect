import { emailRegex, phoneNumberRegex } from ".";

export const candidatesSignUpRules = [
    {
      field: "name",
      validations: [
        {
          message: "Name is required",
          validate: (value) => value !== "",
        },
      ],
    },
    {
      field: "email",
      validations: [
        {
          message: "Email is required",
          validate: (value) => value !== "",
        },
        {
          message: "Email is invalid",
          validate: (value) => emailRegex.test(value),
        },
      ],
    },
    {
      field: "phoneNumber",
      validations: [
        {
          message: "Phone number is required",
          validate: (value) => value !== "",
        },
        {
          message: "Phone number is invalid",
          validate: (value) => phoneNumberRegex.test(value),
        },
      ],
    },
    {
      field: "address",
      validations: [
        {
          message: "Address is required",
          validate: (value) => value !== "",
        },
      ],
    },
    {
      field: "password",
      validations: [
        {
          message: "Password is required",
          validate: (value) => value !== "",
        },
        {
          message: "Password has to be at least 8 characters",
          validate: (value) => value.length >= 8
        }
      ],
    },
    {
      field: "confirmPassword",
      validations: [
        {
          message: "Passwords do not match",
          validate: (value, formData) => value === formData.password,
        },
      ],
    },
  ];