"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { InputField as Input, Button } from "@/ui";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import useAuth from "@/hooks/useAuth";

export default function ChangePassword() {
  const { changePasswordMutation } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string().required("Current password is required"),
      newPassword: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("New password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Passwords must match")
        .required("Confirm your new password"),
    }),
    onSubmit: (values, { resetForm }) => {
      changePasswordMutation.mutate(
        { oldPassword: values.oldPassword, newPassword: values.newPassword },
        {
          onSuccess: () => resetForm(),
        }
      );
    },
  });

  return (
    <div className="bg-white rounded-2xl border border-grey-200 p-6 max-w-2xl">
      <h2 className="text-xl font-bold text-grey-700 mb-2">Change Password</h2>
      <p className="text-sm text-grey-500 mb-6">
        Enter your current password, then choose a new one with at least 8 characters.
      </p>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div>
          <Input
            id="oldPassword"
            name="oldPassword"
            label="Current Password"
            type={showCurrentPassword ? "text" : "password"}
            placeholder="Enter current password"
            value={formik.values.oldPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.oldPassword && formik.errors.oldPassword
                ? formik.errors.oldPassword
                : ""
            }
            icon={showCurrentPassword ? <Eye size={20} fill="inherit" /> : <EyeSlash size={20} fill="inherit" />}
            onIconClick={() => setShowCurrentPassword(!showCurrentPassword)}
          />
        </div>

        <div>
          <Input
            id="newPassword"
            name="newPassword"
            label="New Password"
            type={showNewPassword ? "text" : "password"}
            placeholder="Enter new password"
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.newPassword && formik.errors.newPassword
                ? formik.errors.newPassword
                : ""
            }
            icon={showNewPassword ? <Eye size={20} fill="inherit" /> : <EyeSlash size={20} fill="inherit" />}
            onIconClick={() => setShowNewPassword(!showNewPassword)}
          />
        </div>

        <div>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm New Password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm new password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.confirmPassword && formik.errors.confirmPassword
                ? formik.errors.confirmPassword
                : ""
            }
            icon={showConfirmPassword ? <Eye size={20} fill="inherit" /> : <EyeSlash size={20} fill="inherit" />}
            onIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="filled"
            color="primary"
            radius="lg"
            loading={changePasswordMutation.isPending}
            disabled={changePasswordMutation.isPending}
            className="w-full sm:w-auto min-w-[200px] px-8"
          >
            Update Password
          </Button>
        </div>
      </form>
    </div>
  );
}
