import React, { type ReactElement, type ReactNode, type ComponentType } from "react";
import { Modal, TitleBar, useModal } from "@react95/core";
import { useWindowsStore } from "../store/windows";

// Centralized style objects for maintainability and clarity
const styles = {
  desktopIcon: {
    alignItems: "center",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    padding: "10px",
    borderRadius: "8px",
    textAlign: "center",
    width: "100px",
    gap: "10px",
  },
  iconImage: {
    height: "32px",
    marginBottom: "8px",
    width: "32px",
  },
  iconName: {
    color: "#ffffff",
    fontSize: "14px",
    margin: "0",
    textShadow: "1px 1px 3px rgba(0, 0, 0, 0.7)",
    userSelect: "none" as const,
  },
  window: {
    background: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
    display: "flex",
    flexDirection: "column",
  },
  titleBar: {
    alignItems: "center",
    background: "#f0f0f0",
    borderTopLeftRadius: "8px",
    borderTopRightRadius: "8px",
    cursor: "move",
    display: "flex",
    fontWeight: "bold",
    justifyContent: "space-between",
    padding: "8px",
  },
  closeButton: {
    alignItems: "center",
    background: "#ff5f56",
    border: "1px solid #e04440",
    borderRadius: "50%",
    color: "#9a0000",
    cursor: "pointer",
    display: "flex",
    fontSize: "10px",
    height: "15px",
    justifyContent: "center",
    lineHeight: "10px",
    width: "15px",
  },
  windowContent: {
    flex: "1",
    overflow: "auto",
    padding: "20px",
  },
  modalCenteringWrapper: {
    position: "fixed" as const,
    top: "45%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 9999,
  },
  resizableContainer: {
    overflow: "auto" as const,
    minWidth: "300px",
    minHeight: "200px",
    width: "100%",
    height: "100%",
  },
} as const;

interface WindowProps {
  icon: string | ReactElement<{ variant?: string }>;
  title: string;
  children: ReactNode;
  width?: number;
  height?: number;
  onClose: () => void;
}

export const Window = ({ title, onClose, children, icon, width, height }: WindowProps) => {
  const { minimize } = useModal();
  const w = width ? `${width}px` : "100vw";
  const h = height ? `${height}px` : "70vh";

  const iconNode = typeof icon === 'string'
    ? <img src={icon} alt={title} width={16} height={16} />
    : icon;

  return (
    <SafeModal
      id={title}
      icon={iconNode}
      title={title}
      bounds="body"
      dragOptions={{ bounds: "body" }}
      style={{
        width: w,
        height: h, top: `calc(50vh - (${h} / 2))`,left: `calc(50vw - (${w} / 2))`,
        flexDirection: "column",
        resize: "both",overflow: "hidden",}}
      titleBarOptions={[
        <TitleBar.Minimize
          style={{ marginBlock: "auto" }}
          key="maximize"
          onClick={() => minimize(title)}
        />,
        <TitleBar.Close
          style={{ marginBlock: "auto" }}
          key="close"
          onClick={onClose}
        />,
      ]}
    >
      <Modal.Content
        style={{
          padding: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <div style={styles.resizableContainer}>
          {children}
        </div>
      </Modal.Content>
    </SafeModal>
  );
};

interface DesktopIconProps {
  icon: string | ReactElement<{ variant?: string }>;
  name: string;
  children: ReactNode;
  width?: number;
  height?: number;
}

const DesktopIcon = ({
  icon,
  name,
  children,
  width,
  height,
}: DesktopIconProps) => {
  const { openWindow, closeWindow, isWindowOpen } = useWindowsStore();
  const isOpen = isWindowOpen(name);
  const {restore} = useModal();

  const handleClick = () => {
    if(!isOpen){
      openWindow(name);
    } else{
      restore(name);
    }

  };

  const handleCloseWindow = () => {
    closeWindow(name);
  };

  return (
    <>
      <div style={styles.desktopIcon} onClick={handleClick}>
        {typeof icon === "string" ? (
          <img src={icon} alt={name} style={styles.iconImage} />
        ) : (
          React.cloneElement(icon, { variant: "32x32_4" })
        )}
        <p style={styles.iconName}>{name}</p>
      </div>
      {isOpen && (
        <Window
          width={width}
          height={height}
          icon={icon}
          title={name}
          onClose={handleCloseWindow}
        >
          {children}
        </Window>
      )}
    </>
  );
};

export default DesktopIcon;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SafeModal = Modal as unknown as ComponentType<any>;