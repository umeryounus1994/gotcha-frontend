import { Button as ButtonMantine, useMantineTheme } from "@mantine/core";

const Button = ({
  leftIcon,
  label,
  onClick,
  w,
  compact,
  loading,
  type,
  iconWidth = "16px",
  disabled,
  size = "md",
  variant = "filled",
  primary = true,
  children,
  ...props
}) => {
  // Remove label from props to prevent it from being spread as HTML attribute
  const { label: propsLabel, ...restProps } = props;
  const buttonLabel = label || propsLabel || children;
  
  return (
    <ButtonMantine
      compact={compact}
      disabled={disabled}
      loading={loading}
      w={w}
      size={size}
      radius={"md"}
      variant="filled"
      styles={{
        root: {
          backgroundColor: primary ? "#1b8eb7" : "#3ea662",
          color: disabled ? "#999" : "#fff",
          "&:hover": {
            backgroundColor: primary ? "#1590b3" : "#2d8f4f",
            color: "#fff",
          },
          "&:disabled": {
            backgroundColor: "#e0e0e0",
            color: "#999",
          },
        },
        label: {
          color: disabled ? "#999" : "#fff",
          fontWeight: 500,
        },
        inner: {
          color: disabled ? "#999" : "#fff",
        },
      }}
      leftSection={
        leftIcon ? (
          <img
            src={new URL(`../../../assets/${leftIcon}`, import.meta.url).href}
            alt="icon"
            width={iconWidth}
          />
        ) : (
          ""
        )
      }
      type={type}
      onClick={onClick}
      {...restProps}
    >
      {buttonLabel || children}
    </ButtonMantine>
  );
};
export default Button;
