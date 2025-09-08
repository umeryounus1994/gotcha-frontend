import { ActionIcon, Badge, Text, Flex } from "@mantine/core";
import AddVersionModal from "./AddVersionModal";
import ActionIcons from "../../components/general/ActionIcons";

export const Columns = (onHandleStatus, advanced = false) => [
  {
    name: "Version",
    selector: (row) => row.Version,
    width: "200px",
    sortable: true,
  },
  {
    name: "Build Number",
    selector: (row) => row.BuildNumber,
    sortable: true,
    width: "230px",
  },
  {
    name: "Status",
    selector: (row) => row.IsActive,
    center: true,
    width: "200px",
    cell: (row) => (
      <Badge bg={row.IsActive ? "green" : "red"}>
        {row.IsActive ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    name: "Actions", 
    center: true,
    width: "200px",
    cell: (row) => (
      <Flex gap="xs">
        <AddVersionModal edit={true} data={row} />
        <ActionIcons
          type="Versions"
          del={true}
          rowData={row}
        />
      </Flex>
    ),
  },
];
