import { Group, Modal, PasswordInput, Stack } from "@mantine/core";
import React, { useContext } from "react";
import Button from "../../components/general/Button";
import { useDisclosure } from "@mantine/hooks";
import InputField from "../../components/general/InputField";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { backendUrl } from "../../constants";
import toast from "react-hot-toast";
import { UserContext } from "../../context";

const RegisterRegulator = () => {
  const queryClient = useQueryClient();
  const { user } = useContext(UserContext);
  const [opened, { toggle }] = useDisclosure(false);

  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      FullName: "",
      Email: "",
      Password: "",
      ConfirmPassword: "",
    },
    validate: {
      FullName: (value) => (value?.length > 0 ? null : "Enter Full Name"),
      Email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      Password: (value) =>
        value?.length >= 6
          ? null
          : "Password must be at least 6 characters",
      ConfirmPassword: (value, values) =>
        value === values.Password ? null : "Passwords do not match",
    },
  });

  const handleRegister = useMutation(
    async (values) => {
      if (!user?.accessToken) {
        toast.error("You must be logged in as an admin to register regulators");
        throw new Error("No access token");
      }
      const { ConfirmPassword, ...registerData } = values;
      return axios.post(backendUrl + `/regulator/register`, registerData, {
        headers: {
          authorization: `${user?.accessToken}`,
        },
      });
    },
    {
      onSuccess: (res) => {
        if (res.data.success) {
          toast.success(res.data.message);
          queryClient.invalidateQueries("fetchRegulators");
          toggle();
          form.reset();
        } else {
          toast.error(res.data.message || "Registration failed");
        }
      },
      onError: (err) => {
        toast.error(
          err.response?.data?.message || "Registration failed. Please try again."
        );
      },
    }
  );

  return (
    <>
      <Button label={"Register Regulator"} onClick={toggle} />
      <Modal
        title="Register New Regulator"
        opened={opened}
        onClose={() => {
          toggle();
          form.reset();
        }}
        centered
        styles={{ title: { fontWeight: 600 } }}
        size="md"
      >
        <form
          onSubmit={form.onSubmit(
            (values) => {
              handleRegister.mutate(values);
            },
            (errors) => {
              toast.error("Please fix the form errors");
            }
          )}
        >
          <Stack>
            <InputField
              label={"Full Name"}
              form={form}
              required={true}
              validateName={"FullName"}
              placeholder="John Doe"
            />
            <InputField
              label={"Email"}
              form={form}
              required={true}
              validateName={"Email"}
              placeholder="regulator@example.com"
            />
            <PasswordInput
              label="Password"
              placeholder="Minimum 6 characters"
              required
              {...form.getInputProps("Password")}
            />
            <PasswordInput
              label="Confirm Password"
              placeholder="Re-enter password"
              required
              {...form.getInputProps("ConfirmPassword")}
            />
            <Group gap={"md"} justify="flex-end" mt="md">
              <Button
                label={"Cancel"}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  toggle();
                  form.reset();
                }}
                variant="outline"
                bg="gray"
                primary={false}
              />
              <Button
                label={"Register"}
                type={"submit"}
                loading={handleRegister.isLoading}
              />
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
};

export default RegisterRegulator;

