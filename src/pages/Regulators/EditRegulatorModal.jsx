import { Group, Modal, PasswordInput, Stack, Switch } from "@mantine/core";
import React, { useContext, useEffect } from "react";
import Button from "../../components/general/Button";
import { useDisclosure } from "@mantine/hooks";
import InputField from "../../components/general/InputField";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { backendUrl } from "../../constants";
import toast from "react-hot-toast";
import { UserContext } from "../../context";
import { Pencil } from "tabler-icons-react";
import { ActionIcon } from "@mantine/core";

const EditRegulatorModal = ({ data }) => {
  const queryClient = useQueryClient();
  const { user } = useContext(UserContext);
  const [opened, { toggle }] = useDisclosure(false);

  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      Id: "",
      FullName: "",
      Email: "",
      Password: "",
      IsActive: true,
    },
    validate: {
      Email: (value) => (value?.length > 0 && /^\S+@\S+$/.test(value) ? null : "Invalid email"),
      FullName: (value) => (value?.length > 0 ? null : "Enter Full Name"),
    },
  });

  useEffect(() => {
    if (data && opened) {
      form.setValues({
        Id: data._id || data.Id,
        FullName: data.FullName || "",
        Email: data.Email || "",
        Password: "", // Don't pre-fill password
        IsActive: data.IsActive !== false,
      });
    }
  }, [data, opened]);

  const handleUpdate = useMutation(
    async (values) => {
      const updateData = {
        Id: values.Id,
      };
      
      // Only include fields that are provided
      if (values.FullName) updateData.FullName = values.FullName;
      if (values.Email) updateData.Email = values.Email;
      if (values.Password && values.Password.length > 0) {
        updateData.Password = values.Password;
      }
      if (values.IsActive !== undefined) updateData.IsActive = values.IsActive;

      return axios.post(backendUrl + `/regulator/update`, updateData, {
        headers: {
          authorization: `${user?.accessToken || ""}`,
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
          toast.error(res.data.message || "Update failed");
        }
      },
      onError: (err) => {
        toast.error(
          err.response?.data?.message || "Update failed. Please try again."
        );
      },
    }
  );

  return (
    <>
      <ActionIcon onClick={toggle}>
        <Pencil />
      </ActionIcon>
      <Modal
        title="Edit Regulator"
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
              handleUpdate.mutate(values);
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
              placeholder="Leave blank to keep current password"
              description="Only enter if you want to change the password"
              {...form.getInputProps("Password")}
            />
            <Switch
              label="Active Status"
              description="Activate or deactivate this regulator"
              {...form.getInputProps("IsActive", { type: "checkbox" })}
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
                label={"Update"}
                type={"submit"}
                loading={handleUpdate.isLoading}
              />
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
};

export default EditRegulatorModal;

