import styled from "styled-components";
import KeyValuePair from "./KeyValuePair";
import LineBreak from "./LineBreak";
import { useEffect, useState } from "react";

// additional types omitted for brevity
export interface InscriptionDetailI {
    id: string;
    number: number;
    address: string;
    genesis_tx_id: string;
    location: string;
    content_type: string;
    content_length: number;
    value: number;
}

const BASE_URL = "https://ord.xverse.app/content/";

const InscriptionImage = styled.img((props) => (props.theme.fillContent));

const InscriptionIframe = styled.iframe((props) => ({
    ...props.theme.fillContent,
    border: "none",
}));

const ContentWrapper = styled.div(() => ({
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
    width: "100%",
    height: "100%",
    position: "absolute",
    alignItems: "center",
}));

const BreakText = styled.span(() => ({
    display: "inline-block",
    wordWrap: "break-word",
    width: '100%',
    textAlign: 'center'
}));


function Text({ children }: { children: React.ReactNode }) {
    return (
        <TextContainer>
            <BreakText>
                {children}
            </BreakText>
        </TextContainer>
    );
}

function InscriptionContent({ contentType, id }: { contentType: string, id: string }) {
    if (contentType.match(/html|svg/)) {
        // lesser evil compared to dangerouslySetInnerHTML in terms of security
        return <InscriptionIframe src={`${BASE_URL}${id}`} />
    } else if (contentType.match(/image/)) {
        return <InscriptionImage src={`${BASE_URL}${id}`} />
    } else if (contentType.match(/text/)) {
        return <InscriptionText id={id} />
    } else {
        return <Text>Unsupported content</Text>
    }
}

// obey rule of hooks while conditionally fetching data
function InscriptionText({ id }: { id: string }) {
    const [textContent, setTextContent] = useState<string>("");

    useEffect(() => {
        async function fetchTextContent() {
            const response = await fetch(`${BASE_URL}${id}`);
            const text = await response.text();
            setTextContent(text);
        }
        fetchTextContent();
    }, [id]);

    return <Text>{textContent}</Text>
}

export function InscriptionDetail({ data: { id, number, address, genesis_tx_id, location, content_type, content_length, value } }: { data: InscriptionDetailI }) {
    return (
        <>
            <ContentWrapper>
                <InscriptionContent contentType={content_type} id={id} />
            </ContentWrapper>
            <HeaderText>Inscription {number}</HeaderText>
            <LineBreak />
            <KeyValuePair keyString="Inscription ID" value={id} shaded={false} />
            <KeyValuePair keyString="Owner Address" value={address} shaded={false} />
            <HeaderText>Attributes</HeaderText>
            <KeyValuePair keyString="Output Value" value={value.toString()} />
            <KeyValuePair keyString="Content Type" value={content_type.split(";")[0]} />
            <KeyValuePair keyString="Content Length" value={`${content_length} ${content_length > 1 ? "bytes" : "byte"}`} />
            <KeyValuePair keyString="Location" value={location} truncate />
            <KeyValuePair keyString="Genesis Transaction" value={genesis_tx_id} truncate />
        </>
    );
}
