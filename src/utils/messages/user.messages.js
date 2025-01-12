module.exports = {
  validation: {
    firstName: {
      required: 'First name is required',
      minlength: 'First name must be at least 4 characters long',
      maxlength: 'First name cannot exceed 20 characters',
    },
    lastName: {
      maxlength: 'Last name cannot exceed 20 characters',
    },
    email: {
      required: 'Email is required',
      invalid: 'Invalid email format',
    },
    password: {
      required: 'Password is required',
      minlength: 'Password must be at least 8 characters long',
      weak: 'Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character.',
    },
    age: {
      min: 'Age must be at least 18',
      max: 'Age cannot exceed 150',
    },
    gender: {
      required: 'Gender is required',
      message: 'Gender must be either male, female, or other',
    },
    about: {maxlength: 'About section must not exceed 500 characters'},
    skills: {message: 'Skills cannot have more than 10 items'},
    photoUrl: {message: 'Photo URL must be a valid URL'},
  },
  actions: {
    create: 'User created successfully',
    update: 'User updated successfully',
    delete: 'User deleted successfully',
  },
};
