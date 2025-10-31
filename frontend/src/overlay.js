export const LoadingOverlay = ({ loadingState }) => {
  let message = "Please wait...";

  if (loadingState.fetch) message = "Fetching users...";
  else if (loadingState.add) message = "Adding user...";
  else if (loadingState.edit) message = "Editing user...";
  else if (loadingState.delete) message = "Deleting user...";
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        color: "white",
      }}
    >
      <div
        style={{
          width: "60px",
          height: "60px",
          border: "6px solid #f3f3f3",
          borderTop: "6px solid #3498db",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      <p style={{ marginTop: "1rem" }}>{message}</p>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};
