import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Toast from 'components/ux/toast/Toast';

/**
 * Maintenance and Feedback Form
 * Allows users to report maintenance issues and provide feedback/ratings.
 */
const MaintenanceAndFeedbackForm = () => {
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = async (values) => {
    console.log('Submitted Values:', values);
    // Simulate an API call
    const response = { success: true }; // Mock response

    if (response.success) {
      setToastMessage('Form submitted successfully!');
      setShowToast(true);
    } else {
      setToastType('error');
      setToastMessage('Failed to submit the form.');
      setShowToast(true);
    }
  };
  const validationSchema = Yup.object().shape({
    role: Yup.string().required('Role is required'),

    // Conditional validation for issueDescription (for Staff only)
    issueDescription: Yup.string().when('role', {
      is: 'Staff', // When the role is 'Staff'
      then: Yup.string().required('Issue description is required'),
      otherwise: Yup.string().notRequired(),
    }),

    // Conditional validation for priority (for Staff only)
    priority: Yup.string().when('role', {
      is: 'Staff',
      then: Yup.string().required('Priority is required'),
      otherwise: Yup.string().notRequired(),
    }),

    // Conditional validation for feedback (for Guests only)
    feedback: Yup.string().when('role', {
      is: 'Guest', // When the role is 'Guest'
      then: Yup.string().required('Feedback is required'),
      otherwise: Yup.string().notRequired(),
    }),

    // Conditional validation for rating (Guests must provide rating)
    rating: Yup.number()
      .typeError('Rating must be a number')
      .min(1, 'Rating must be at least 1')
      .max(5, 'Rating cannot exceed 5')
      .when('role', {
        is: 'Guest', // When the role is 'Guest'
        then: Yup.number().required('Rating is required'),
        otherwise: Yup.number().notRequired(),
      }),
  });
  return (
    <div className="maintenance-feedback-form">
      <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
        <Formik
          initialValues={{
            role: 'Guest', // Default role
            issueDescription: '',
            priority: '',
            feedback: '',
            rating: '',
            status: 'Pending', // Default resolution status
            attachment: null, // Optional file upload
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => handleSubmit(values)}
        >
          {({ setFieldValue, values }) => (
            <Form className="w-full max-w-lg p-4 shadow-md md:p-8">
              <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold text-brand">
                  Maintenance & Feedback
                </h2>
                <p className="text-gray-500">
                  Report issues or share your feedback to help us improve!
                </p>
              </div>

              {/* Role Selection */}
              <div className="mb-6">
                <label htmlFor="role" className="block mb-2 text-gray-700">
                  Role
                </label>
                <Field
                  as="select"
                  name="role"
                  className="border block w-full px-4 py-3 mb leading-tight text-gray-700 bg-gray-200 rounded appearance-none focus:outline-none focus:bg-white"
                >
                  <option value="Guest">Guest</option>
                  <option value="Staff">Staff</option>
                </Field>
                <ErrorMessage
                  name="role"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Maintenance Issue Reporting for Staff */}
              {values.role === 'Staff' && (
                <>
                  <div className="mb-6">
                    <label
                      htmlFor="issueDescription"
                      className="block mb-2 text-gray-700"
                    >
                      Issue Description
                    </label>
                    <Field
                      name="issueDescription"
                      as="textarea"
                      placeholder="Describe the issue..."
                      className="border block w-full px-4 py-3 mb leading-tight text-gray-700 bg-gray-200 rounded appearance-none focus:outline-none focus:bg-white"
                    />
                    <ErrorMessage
                      name="issueDescription"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="priority"
                      className="block mb-2 text-gray-700"
                    >
                      Priority
                    </label>
                    <Field
                      as="select"
                      name="priority"
                      className="border block w-full px-4 py-3 mb leading-tight text-gray-700 bg-gray-200 rounded appearance-none focus:outline-none focus:bg-white"
                    >
                      <option value="">Select Priority</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </Field>
                    <ErrorMessage
                      name="priority"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="attachment"
                      className="block mb-2 text-gray-700"
                    >
                      Attachment (optional)
                    </label>
                    <input
                      type="file"
                      onChange={(event) =>
                        setFieldValue('attachment', event.target.files[0])
                      }
                      className="border block w-full px-4 py-2 text-gray-700 bg-gray-200 rounded appearance-none focus:outline-none focus:bg-white"
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="status"
                      className="block mb-2 text-gray-700"
                    >
                      Status
                    </label>
                    <Field
                      as="select"
                      name="status"
                      className="border block w-full px-4 py-3 mb leading-tight text-gray-700 bg-gray-200 rounded appearance-none focus:outline-none focus:bg-white"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </Field>
                  </div>
                </>
              )}

              {/* Feedback and Rating for Guests */}
              {values.role === 'Guest' && (
                <>
                  <div className="mb-6">
                    <label
                      htmlFor="feedback"
                      className="block mb-2 text-gray-700"
                    >
                      Feedback
                    </label>
                    <Field
                      name="feedback"
                      as="textarea"
                      placeholder="Share your feedback..."
                      className="border block w-full px-4 py-3 mb leading-tight text-gray-700 bg-gray-200 rounded appearance-none focus:outline-none focus:bg-white"
                    />
                    <ErrorMessage
                      name="feedback"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="rating"
                      className="block mb-2 text-gray-700"
                    >
                      Rating (1-5)
                    </label>
                    <Field
                      name="rating"
                      type="number"
                      placeholder="Rate our service"
                      className="border block w-full px-4 py-3 mb leading-tight text-gray-700 bg-gray-200 rounded appearance-none focus:outline-none focus:bg-white"
                      min={1}
                      max={5}
                    />
                    <ErrorMessage
                      name="rating"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </>
              )}

              {/* Submit Button */}
              <div className="flex items-center w-full my-3">
                <button
                  type="submit"
                  className="w-full px-4 py-2 font-bold text-white rounded bg-brand hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                >
                  Submit
                </button>
              </div>

              {showToast && (
                <Toast type={toastType} message={toastMessage} dismissError />
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default MaintenanceAndFeedbackForm;
