import { Group, Modal, Stack, Switch, Textarea } from "@mantine/core";
import React, { useContext, useEffect } from "react";
import Button from "../../components/general/Button";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { backendUrl } from "../../constants";
import toast from "react-hot-toast";
import { UserContext } from "../../context";
import { Pencil } from "tabler-icons-react";
import { ActionIcon } from "@mantine/core";

const EditPrizePoolDataModal = ({ data }) => {
  const queryClient = useQueryClient();
  const { user } = useContext(UserContext);
  const [opened, { toggle }] = useDisclosure(false);

  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      Id: "",
      UserIdVerified: false,
      Notes: "",
      Status: "Active",
    },
  });

  useEffect(() => {
    if (data && opened) {
      form.setValues({
        Id: data._id || data.Id,
        UserIdVerified: data.UserIdVerified || false,
        Notes: data.Notes || "",
        Status: data.Status || "Active",
      });
    }
  }, [data, opened]);

  const handleUpdate = useMutation(
    async (values) => {
      const updateData = {
        Id: values.Id,
      };

      if (values.UserIdVerified !== undefined)
        updateData.UserIdVerified = values.UserIdVerified;
      if (values.Notes !== undefined) updateData.Notes = values.Notes;
      if (values.Status !== undefined) updateData.Status = values.Status;

      return axios.post(backendUrl + `/prize-pool-data/update`, updateData, {
        headers: {
          authorization: `${user?.accessToken || ""}`,
        },
      });
    },
    {
      onSuccess: (res) => {
        if (res.data.success) {
          toast.success(res.data.message);
          queryClient.invalidateQueries("fetchPrizePoolData");
          queryClient.invalidateQueries("fetchPrizePoolDataStats");
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
        title="Edit Prize Pool Data Entry"
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
          onSubmit={form.onSubmit((values) => {
            handleUpdate.mutate(values);
          })}
        >
          <Stack>
            <Switch
              label="User Verified"
              description="Mark if the user has been verified"
              {...form.getInputProps("UserIdVerified", { type: "checkbox" })}
            />
            <Textarea
              label="Notes"
              placeholder="Add any notes or comments"
              {...form.getInputProps("Notes")}
              minRows={3}
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

export default EditPrizePoolDataModal;

