import styled from "styled-components";
import KeyValuePair from "./KeyValuePair";
import LineBreak from "./LineBreak";
import { useEffect, useState } from "react";

export interface InscriptionDetailI {
    id: string;
    number: number;
    address: string;
    genesis_address: string;
    genesis_block_height: number;
    genesis_block_hash: string;
    genesis_tx_id: string;
    genesis_fee: number;
    genesis_timestamp: number;
    location: string;
    output: string;
    offset: number;
    sat_ordinal: number;
    sat_rarity: string;
    sat_coinbase_height: number;
    mime_type: string;
    content_type: string;
    content_length: number;
    tx_id: string;
    timestamp: number;
    value: number;
}

const InscriptionImage = styled.img(() => ({
    width: "100%",
    height: "100%",
    objectFit: "contain",
    position: "absolute",
    top: 0,
    left: 0,
}));

const ImageWrapper = styled.div(() => ({
    // weird design where the image overflows out of the container
    // some hacky css needed
    // I'd rather not have to individually apply padding to each element
    width: "calc(100% + 36px)",
    position: "relative",
    margin: "0 -16px",
    paddingBottom: "calc(100% + 36px)",
    overflow: "hidden",
}));

const HeaderText = styled.h1(() => ({
    fontSize: "16px",
    fontWeight: 600,
    padding: "24px 0 17px 0",
    margin: 0
}));

const TextContainer = styled.span(() => ({
    display: "flex",
    justifyContent: "center",
    wordWrap: "break-word",
    width: "100%",
    height: "100%",
    position: "absolute",
    alignItems: "center",
}));

export function InscriptionDetail({ data }: { data: InscriptionDetailI }) {
    const [textContent, setTextContent] = useState("");

    useEffect(() => {
        async function fetchTextContent() {
            const response = await fetch(`https://ord.xverse.app/content/${data.id}`);
            const text = await response.text();
            setTextContent(text);
        }
        fetchTextContent();
    }, [data.id]);

    return (
        <>
            <ImageWrapper>
                {/* doesn't work for SVG / HTML content, need to use dangerouslySetInnerHTML or something */}
                {data.content_type.match(/image/) ? (

                    <InscriptionImage src={`https://ord.xverse.app/content/${data.id}`} />

                ) : <TextContainer>{textContent}</TextContainer>}
            </ImageWrapper>
            <HeaderText>Inscription {data.number}</HeaderText>
            <LineBreak />
            <KeyValuePair keyString="Inscription ID" value={data.id} shaded={false} />
            <KeyValuePair keyString="Owner Address" value={data.address} shaded={false} />
            <HeaderText>Attributes</HeaderText>
            <KeyValuePair keyString="Output Value" value={data.value.toString()} />
            <KeyValuePair keyString="Content Type" value={data.content_type.split(";")[0]} />
            <KeyValuePair keyString="Content Length" value={`${data.content_length} ${data.content_length > 1 ? "bytes" : "byte"}`} />
            <KeyValuePair keyString="Location" value={data.location} truncate />
            <KeyValuePair keyString="Genesis Transaction" value={data.genesis_tx_id} truncate />
        </>
    );
}
