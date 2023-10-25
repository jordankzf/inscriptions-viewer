import styled from 'styled-components';
import ArrowRight from '../assets/img/arrow_right.svg';
import { SectionContainer } from './SectionContainer';

export interface InscriptionsI {
    content_type: string;
    id: string;
    offset: number
};

const InscriptionRow = styled.div(() => ({
    display: 'flex',
    justifyContent: 'space-between',
    padding: '16px 0',
    cursor: 'pointer',
}));

const RightCaret = styled.img(() => ({
    paddingRight: '11px',
})
)

const LoadMoreButton = styled.button((props) => ({
    ...props.theme.button,
    width: '33%',
}));

function trimToChars(str: string, numberOfChars: number = 8) {
    return str.substring(0, numberOfChars);
}

export function InscriptionsList({ inscriptions, handleLoadMore, showLoadMore, navigate, walletAddress }: { inscriptions: Array<InscriptionsI>, handleLoadMore: () => void, showLoadMore: boolean, navigate: (path: string) => void, walletAddress: string }) {
    return (<>
        {inscriptions && <SectionContainer>
            <label>Results</label>
            {inscriptions?.map(({ id }) => (
                <div onClick={() => navigate(`/detail/${walletAddress}/${id}`)} key={id}>
                    <InscriptionRow><span>Inscription {trimToChars(id)}</span>
                        <RightCaret alt="back" src={ArrowRight} />
                    </InscriptionRow>
                </div>
            ))}
            {showLoadMore && <center><LoadMoreButton onClick={handleLoadMore}>Load more</LoadMoreButton></center>}
        </SectionContainer>}</>)
}