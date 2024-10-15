import { emailRegex, phoneNumberRegex } from ".";

export const recruitersSignUpRules = [
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
    field: "password",
    validations: [
      {
        message: "Password is required",
        validate: (value) => value !== "",
      },
      {
        message: "Password has to be at least 8 characters",
        validate: (value) => value.length >= 8,
      },
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

export const createCompanyRules = [
    {
        field: "name",
        validations: [
            {
                message: "Name is required",
                validate: (value) => value !== ""
            },
        ]
    },
    {
      field: "size",
      validations: [
          {
              message: "Size is required",
              validate: (value) => value !== ""
          },
      ]
  },
  {
    field: "website",
    validations: [
        {
            message: "Website is required",
            validate: (value) => value !== ""
        },
    ]
},
];

export const createJobRules = [
    {
        field: "title",
        validations: [
            {
                message: "Title is required",
                validate: (value) => value !== "" 
            },
        ]
    },
    {
        field: "description",
        validations: [
            {
                message: "Description is required",
                validate: (value) => value !== ""
            }
        ]
    },
    {
        field: "fieldId",
        validations: [
            {
                message: "Field is required",
                validate: (value) => value !== ""&& value !== null && value !== undefined
            }
        ]
    },
    {
        field: "salary",
        validations: [
            {
                message: "Salary is required",
                validate: (value) => value !== ""
            }
        ]
    },
    {
        field: "deadline",
        validations: [
            {
                message: "Deadline is required",
                validate: (value) => value !== ""
            }
        ]
    },
    {
      field: "type",
      validations: [
        {
          message: "Type is required",
          validate: (value) => value !== 5 && value !== undefined && value !== null
        }
      ]
    }
]