import { Badge, Text } from "@mantine/core";
import ActionIcons from "../../components/general/ActionIcons";
import EditRegulatorModal from "./EditRegulatorModal";

export const Columns = () => [
  {
    name: "Full Name",
    selector: (row) => row.FullName,
    width: "200px",
    sortable: true,
  },
  {
    name: "Email",
    selector: (row) => row.Email,
    sortable: true,
    width: "250px",
  },
  {
    name: "Role",
    selector: (row) => row.Role,
    center: true,
    width: "150px",
    cell: (row) => (
      <Badge color="blue" variant="light">
        {row?.Role || "Regulator"}
      </Badge>
    ),
  },
  {
    name: "Registration Date",
    selector: (row) => row.CreationTimestamp || row.createdAt,
    sortable: true,
    center: true,
    width: "180px",
    cell: (row) => (
      <Text>
        {row.CreationTimestamp || row.createdAt
          ? new Date(row.CreationTimestamp || row.createdAt).toLocaleDateString()
          : "N/A"}
      </Text>
    ),
  },
  {
    name: "Status",
    selector: (row) => row.IsActive,
    center: true,
    width: "120px",
    cell: (row) => (
      <Badge bg={row.IsActive !== false ? "green" : "red"}>
        {row.IsActive !== false ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    name: "Actions",
    center: true,
    width: "100px",
    cell: (row) => (
      <ActionIcons
        rowData={row}
        edit={<EditRegulatorModal data={row} />}
        del={true}
        type="Regulator"
      />
    ),
  },
];

