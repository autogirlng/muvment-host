"use client";

import { useState } from "react";
import { Form, Formik } from "formik";
import { getCountryCallingCode } from "react-phone-number-input";
import useUpdateProfile from "@/hooks/profile/useUpdateProfile";
import { useAppSelector } from "@/lib/hooks";
import { ProfileFormValues } from "@/types";
import {
  getInitialsFromName,
  replaceCharactersWithString,
} from "@/utils/functions";
import { profileFormValidationSchema } from "@/utils/validationSchema";
import {
  Button,
  InputField,
  PhoneNumberAndCountryField,
  ProfilePhotoUpload,
} from "@/ui";


export default function ProfilePage() {
  let { user } = useAppSelector((state) => state.user);
  console.log(user)
  const [isProfileEditable, setIsProfileEditable] = useState<boolean>(false);
  const { updateProfileMutation, uploadImage } = useUpdateProfile(setIsProfileEditable);
  return (
    <main className="py-[56px] md:space-y-11 text-grey-700">
      <h5 className="text-h5 md:text-h3 3xl:text-4xl !font-bold">My Account</h5>
      <Formik
        initialValues={
          {
            firstName: user?.data.firstName || "",
            lastName: user?.data.lastName || "",
            ...(user?.data.phoneVerified
              ? {}
              : { phoneNumber: user?.data.phoneNumber || "" }),
            country: "NG",
            countryCode: "+234",
            profileImage: user?.data.profilePictureUrl || "",
          } as ProfileFormValues
        }
        onSubmit={async (values, { setSubmitting }) => {

          const {
            profileImage,
            ...submittedValues
          } = values;

          updateProfileMutation.mutate(submittedValues);
          setSubmitting(false);
        }}
        validationSchema={profileFormValidationSchema}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {(props) => {
          const {
            values,
            touched,
            errors,
            isValid,
            dirty,
            handleBlur,
            handleChange,
            setFieldValue,
            setFieldTouched,
            isSubmitting,
            resetForm,
          } = props;

          return (
            <div className="md:bg-grey-50 md:rounded-[52px] py-[60px] md:py-10 md:px-[52px] md:space-y-[60px] relative">
              <h4 className="hidden md:block text-h5 3xl:text-h4 !font-bold">
                PROFILE INFORMATION
              </h4>

              <Form className="max-w-[800px] space-y-[60px]">
                <div className="space-y-7">
                  <ProfilePhotoUpload
                    title="Profile Picture"
                    id="profileImage"
                    name="profileImage"
                    label=""
                    value={values?.profileImage || ""}
                    image={user?.data.profilePictureUrl || null}
                    onChange={async (fieldName, file) => {
                      setFieldTouched(fieldName, true);
                      setFieldValue(fieldName, file);

                      if (file) {
                        const formData = new FormData();
                        formData.append(fieldName, file);
                        uploadImage.mutate(formData);
                      }
                    }}
                    isLoading={uploadImage.isPending}
                    showButton={isProfileEditable}
                    disabled={!isProfileEditable}
                    initials={
                      user
                        ? getInitialsFromName(user?.data.firstName || "", user?.data.lastName || "")
                        : ""
                    }
                  />
                  <div className="md:max-w-[370px] space-y-7">
                    <InputField
                      name="firstName"
                      id="firstName"
                      type="text"
                      label="First name"
                      placeholder="Enter first name"
                      value={values.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        errors.firstName && touched.firstName
                          ? errors.firstName
                          : ""
                      }
                      disabled={!isProfileEditable}
                    />
                    <InputField
                      name="lastName"
                      id="lastName"
                      type="text"
                      label="Last name"
                      placeholder="Enter last name"
                      value={values.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        errors.lastName && touched.lastName
                          ? errors.lastName
                          : ""
                      }
                      disabled={!isProfileEditable}
                    />
                    <PhoneNumberAndCountryField
                      inputName="phoneNumber"
                      selectName="country"
                      inputId="phoneNumber"
                      selectId="country"
                      label="Phone Number"
                      inputPlaceholder="Enter phone number"
                      selectPlaceholder="+234"
                      inputValue={
                        user?.data.phoneVerified
                          ? user?.data.phoneNumber
                          : values.phoneNumber
                      }
                      selectValue={
                        user?.data.phoneVerified ? "NG" : values.country
                      }
                      inputOnChange={(event) => {
                        const number = replaceCharactersWithString(
                          event.target.value
                        );
                        setFieldTouched("phoneNumber", true);
                        setFieldValue("phoneNumber", number);
                      }}
                      selectOnChange={(value: string) => {
                        const countryCode = `+${getCountryCallingCode(value as any)}`;
                        setFieldValue("country", value);
                        setFieldValue("countryCode", countryCode);
                      }}
                      inputOnBlur={handleBlur}
                      selectOnBlur={handleBlur}
                      selectClassname="!w-[170px]"
                      inputDisabled={!isProfileEditable || user?.data.phoneVerified}
                      selectDisabled={!isProfileEditable || user?.data.phoneVerified}
                    />

                    <InputField
                      name="email"
                      id="email"
                      type="email"
                      label="Email"
                      placeholder="Enter email address"
                      value={user?.data.email}
                      disabled
                    />
                  </div>
                </div>

                <div className="absolute -top-11 md:top-7 right-0 md:right-[52px] !m-0">
                  {isProfileEditable ? (
                    <div className="flex gap-3 items-center">
                      <Button
                        variant="filled"
                        color="primary"
                        type="submit"
                        className="!py-3 !px-5 !text-sm 3xl:!text-base"
                        loading={
                          isSubmitting || updateProfileMutation.isPending
                        }
                        disabled={
                          isSubmitting ||
                          updateProfileMutation.isPending ||
                          !(isValid && dirty)
                        }
                      >
                        Save Profile
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setIsProfileEditable(false);
                          resetForm();
                        }}
                        className="!py-2.5 !px-5 !text-sm 3xl:!text-base"
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className="!py-3 !px-5 !text-sm 3xl:!text-base"
                      variant="outlined"
                      onClick={() => setIsProfileEditable(true)}
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>
              </Form>
            </div>
          );
        }}
      </Formik>
    </main>
  );
}

