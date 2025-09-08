import { ActionIcon, Group, Modal, Stack } from "@mantine/core";
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

const AddVersionModal = ({ edit = false, data }) => {
  const queryClient = useQueryClient();
  const { user } = useContext(UserContext);
  const [opened, { toggle }] = useDisclosure(false);

  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      Version: "",
      BuildNumber: "",
    },
  });

  useEffect(() => {
    form.setValues(data);
  }, [data, opened]);

  const handleAddVersion = useMutation(
    async (values) => {
      let link = backendUrl + "/versions";
      if (edit) {
        values.Id = data._id;
        link = link + `/update`;
        return axios.post(link, values);
      } else {
        link = link + "/";
        return axios.post(link, values);
      }
    },
    {
      onSuccess: (res) => {
        toast.success(res.data.message);
        queryClient.invalidateQueries("fetchVersions");
        toggle();
        form.reset();
      },
      onError: (err) => {
        toast.error(err.response.data.message);
      },
    }
  );

  return (
    <>
      {edit ? (
        <ActionIcon onClick={toggle}>
          <Pencil />
        </ActionIcon>
      ) : (
        <Button label={"Add Version"} onClick={toggle} />
      )}
      <Modal
        title="Adding Version"
        opened={opened}
        onClose={toggle}
        centered
        styles={{ title: { fontWeight: 600 } }}
      >
        <form
          onSubmit={form.onSubmit((values) => handleAddVersion.mutate(values))}
        >
          <Stack>
            <InputField
              label={"Version"}
              form={form}
              required={true}
              validateName={"Version"}
            />
            <InputField
              label={"Build Number"}
              form={form}
              required={true}
              validateName={"BuildNumber"}
            />
            <Button
              type="submit"
              label={edit ? "Update Version" : "Add Version"}
              loading={handleAddVersion.isLoading}
            />
          </Stack>
        </form>
      </Modal>
    </>
  );
};

export default AddVersionModal;
