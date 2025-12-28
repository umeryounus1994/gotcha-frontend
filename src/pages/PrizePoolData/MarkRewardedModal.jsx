import { Group, Modal, Stack, Textarea } from "@mantine/core";
import React, { useContext } from "react";
import Button from "../../components/general/Button";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { backendUrl } from "../../constants";
import toast from "react-hot-toast";
import { UserContext } from "../../context";

const MarkRewardedModal = ({ data }) => {
  const queryClient = useQueryClient();
  const { user } = useContext(UserContext);
  const [opened, { toggle }] = useDisclosure(false);

  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      notes: "",
    },
  });

  const handleMarkRewarded = useMutation(
    async (values) => {
      return axios.post(
        backendUrl + `/prize-pool-data/mark-rewarded`,
        {
          prizeEntryId: data._id || data.Id,
          notes: values.notes,
        },
        {
          headers: {
            authorization: `${user?.accessToken || ""}`,
          },
        }
      );
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
          toast.error(res.data.message || "Failed to mark as rewarded");
        }
      },
      onError: (err) => {
        toast.error(
          err.response?.data?.message || "Failed to mark as rewarded. Please try again."
        );
      },
    }
  );

  return (
    <>
      <Button
        label="Mark Rewarded"
        onClick={toggle}
        primary={false}
      />
      <Modal
        title="Mark Prize as Rewarded"
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
            handleMarkRewarded.mutate(values);
          })}
        >
          <Stack>
            <Textarea
              label="Notes"
              placeholder="Add notes about prize delivery (optional)"
              description="e.g., Prize delivered to user on [date], tracking number, etc."
              {...form.getInputProps("notes")}
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
                label={"Mark as Rewarded"}
                type={"submit"}
                loading={handleMarkRewarded.isLoading}
              />
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
};

export default MarkRewardedModal;

