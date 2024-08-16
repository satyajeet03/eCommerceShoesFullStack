import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

// Validation schema using Yup
const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  price: Yup.number().required('Price is required').positive('Price must be positive'),
  description: Yup.string(),
  imageUrl: Yup.string().url('Invalid URL'),
});

const Admin: React.FC = () => {
  return (
    <Formik
      initialValues={{
        name: '',
        price: 0,
        description: '',
        imageUrl: '',
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { resetForm }) => {
        try {
          const config = {
            headers: {
              'Content-Type': 'application/json',
            },
          };

          const { data } = await axios.post('/api/shoes', values, config);
          console.log(data);

          alert('Shoe added successfully!');
          resetForm();
        } catch (error) {
          console.error(error);
          alert('Failed to add shoe.');
        }
      }}
    >
      {() => (
        <Form className="p-6 max-w-3xl mx-auto bg-white shadow-lg rounded-lg border border-gray-200">
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">Add New Shoe</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Fill out the details below to add a new shoe to the inventory.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">Name</label>
                  <div className="mt-2">
                    <Field
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter shoe name"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    <ErrorMessage name="name" component="div" className="text-red-600 text-sm mt-1" />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">Price</label>
                  <div className="mt-2">
                    <Field
                      id="price"
                      name="price"
                      type="number"
                      placeholder="Enter price"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    <ErrorMessage name="price" component="div" className="text-red-600 text-sm mt-1" />
                  </div>
                </div>

                <div className="col-span-full">
                  <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">Description</label>
                  <div className="mt-2">
                    <Field
                      as="textarea"
                      id="description"
                      name="description"
                      rows={3}
                      placeholder="Enter shoe description"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    <ErrorMessage name="description" component="div" className="text-red-600 text-sm mt-1" />
                  </div>
                </div>

                <div className="col-span-full">
                  <label htmlFor="imageUrl" className="block text-sm font-medium leading-6 text-gray-900">Image URL</label>
                  <div className="mt-2">
                    <Field
                      id="imageUrl"
                      name="imageUrl"
                      type="text"
                      placeholder="Enter image URL"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    <ErrorMessage name="imageUrl" component="div" className="text-red-600 text-sm mt-1" />
                  </div>
                </div>

                <div className="col-span-full">
                  <label htmlFor="image-upload" className="block text-sm font-medium leading-6 text-gray-900">Upload Image</label>
                  <div className="mt-2 flex items-center gap-x-3">
                    {/* <PhotoIcon aria-hidden="true" className="h-12 w-12 text-gray-300" /> */}
                    <button
                      type="button"
                      className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      Change
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
                type="button"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Add Shoe
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default Admin;
