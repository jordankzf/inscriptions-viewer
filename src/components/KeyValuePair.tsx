import styled from "styled-components";

const KeyValueContainer = styled.div<{ shaded?: boolean }>(({ shaded }) => ({
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '24px',
    marginRight: shaded ? '0' : '30px'
}));

const KeyLabel = styled.span(() => ({
    fontSize: '12px',
    marginBottom: '8px',
    color: 'rgba(255, 255, 255, 0.70)'
}));

const ValueText = styled.span<{ shaded?: boolean }>(({ shaded, ...props }) => ({
    wordWrap: 'break-word',
    backgroundColor: shaded ? props.theme.colors.grey : 'transparent',
    padding: shaded ? '12px 16px' : '0',
    borderRadius: shaded ? '8px' : '0',
}));

function truncateTextFromMiddle(
    text: string,
    length = 16,
): string {
    if (text) {
        if (text.length <= length) {
            return text;
        }
        return `${text.substring(0, length)}...${text.substring(
            text.length - length,
            text.length,
        )}`;
    }
    return "";
}

function KeyValuePair({ keyString, value, shaded = true, truncate = false }: { keyString: string, value: string, shaded?: boolean, truncate?: boolean }) {
    return (
        <KeyValueContainer shaded={shaded}>
            {/* key is a protected keyword haha */}
            <KeyLabel>{keyString}</KeyLabel>
            <ValueText shaded={shaded}>{truncate ? truncateTextFromMiddle(value) : value}</ValueText>
        </KeyValueContainer>
    );
};

export default KeyValuePair;