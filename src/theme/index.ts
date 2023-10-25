const Theme = {
  button: {
    backgroundColor: "#465AE9",
    border: "none",
    height: "46px",
    borderRadius: "10px",
    "&:disabled": {
      opacity: 0.5,
      cursor: "not-allowed",
    },
    cursor: "pointer",
  },
  colors: {
    grey: "#24252C",
  },
  fillContent: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    position: "absolute",
    top: 0,
    left: 0,
  },
};

export default Theme;
