import styled from "styled-components";

const LineBreak = styled.div((props) => ({
  width: "100%",
  height: "2px",
  backgroundColor: props.theme.colors.grey,
  marginBottom: "24px",
}));

export default LineBreak;
