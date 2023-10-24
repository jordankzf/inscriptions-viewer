import Spinner from "../assets/img/loading.svg";
import styled from "styled-components";

const ImageContainer = styled.img(() => ({
    margin: '10% 25% 0',
    width: '50%'
}));

export function Loader() {
    return <ImageContainer src={Spinner} />
}