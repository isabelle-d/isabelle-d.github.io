import React, {
  type CSSProperties,
  type ReactElement,
  type ReactNode,
  type ComponentType,
  useEffect,
  useMemo,
} from "react";
import { Modal, TitleBar, useModal } from "@react95/core";
import { useWindowsStore } from "../store/windows";

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
  resizableContainer: {
    overflow: "auto" as const,
    minWidth: "300px",
    minHeight: 0,
    flex: 1,
    width: "100%",
    boxSizing: "border-box" as const,
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

  // Sizes are capped to the viewport so big windows never run off-screen.
  // Windows are at least 55% of the screen wide and 65% tall, or the size
  // passed from App.tsx if that is larger, and never bigger than 94vw / 85vh.
  const w = `min(max(${width ?? 800}px, 55vw), 94vw)`;
  const h = `min(max(${height ?? 600}px, 65vh), 85vh)`;

  const jitterX = useMemo(() => Math.floor(Math.random() * 80) - 40, []);
  const jitterY = useMemo(() => Math.floor(Math.random() * 80) - 40, []);

  const iconNode = useMemo(
    () =>
      typeof icon === "string" ? (
        <img src={icon} alt={title} width={16} height={16} />
      ) : (
        icon
      ),
    [icon, title]
  );

  const modalStyle = useMemo(
    () => ({
      width: w,
      height: h,
      top: `calc(50vh - (${h} / 2) + ${jitterY}px)`,
      left: `calc(50vw - (${w} / 2) + ${jitterX}px)`,
      flexDirection: "column" as const,
      resize: "both" as const,
      overflow: "hidden" as const,
    }),
    [w, h, jitterX, jitterY]
  );

  return (
    <SafeModal
      id={title}
      icon={iconNode}
      title={title}
      bounds="body"
      dragOptions={{ bounds: "body" }}
      style={modalStyle}
      titleBarOptions={[
        <TitleBar.Minimize
          style={{ marginBlock: "auto" }}
          key="minimize"
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
          minHeight: 0,
        }}
      >
        <div style={styles.resizableContainer}>{children}</div>
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
  openOnLoad?: boolean;
  style?: CSSProperties;
  columnBreakBefore?: boolean;
}

const DesktopIcon = ({
  icon,
  name,
  children,
  width,
  height,
  openOnLoad = false,
  style,
  columnBreakBefore = false,
}: DesktopIconProps) => {
  const { openWindow, closeWindow, isWindowOpen } = useWindowsStore();
  const isOpen = isWindowOpen(name);
  const { restore } = useModal();

  useEffect(() => {
    if (openOnLoad && !isWindowOpen(name)) openWindow(name);
    // Run once on mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = () => {
    if (!isOpen) {
      openWindow(name);
    } else {
      restore(name);
    }
  };

  const handleCloseWindow = () => {
    closeWindow(name);
  };

  return (
    <>
      {columnBreakBefore && (
        <div style={{ flexBasis: "100%", width: 0, height: 0 }} />
      )}
      <div style={{ ...styles.desktopIcon, ...style }} onClick={handleClick}>
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