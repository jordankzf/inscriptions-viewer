import styled from 'styled-components';
import NavigationBar from '../components/NavigationBar';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Loader } from '../components/Loader';
import { InscriptionsI, InscriptionsList } from '../components/InscriptionsList';
import { SectionContainer } from '../components/SectionContainer';
import ErrorMessage from '../components/ErrorMessage';

const TextField = styled.input((props) => ({
  background: props.theme.colors.grey,
  border: 'none',
  outline: 'none',
  height: '32px',
  padding: '0 10px',
}));

const LookUpButton = styled.button((props) => ({
  ...props.theme.button,
}));

interface OrdinalUtxoResponse {
  limit: number;
  offset: number;
  total: number;
  results: {
    txid: string;
    value: number;
    vout: number;
    block_height: number;
    sats: any[];
    inscriptions: InscriptionsI
  }[];
}

export default function Main() {
  const { address: urlAddress } = useParams();

  useEffect(() => {
    if (urlAddress) {
      fetchOrdinalUtxo(urlAddress);
    }
  }, [urlAddress]);

  const [address, setAddress] = useState<string>(urlAddress ?? "");
  const [inscriptions, setInscriptions] = useState<Array<InscriptionsI>>();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [showLoadMore, setShowLoadMore] = useState<boolean>(false);
  const navigate = useNavigate();

  const fetchOrdinalUtxo = async (address: string, nextPage?: number) => {
    try {
      if (!address) {
        throw new Error("Address is required")
      }

      setError("");

      // If page is not provided, default and reset to 1
      if (!nextPage) {
        setPage(1)
        setLoading(true);
        setInscriptions(undefined);
      }

      const offset = ((nextPage ?? 1) - 1) * 30; // Change this if you want to load less than 30 at a time (default)
      const response = await fetch(`https://api-3.xverse.app/v1/address/${address}/ordinal-utxo?offset=${offset}`);
      const json = await response.json();

      if (json.status === 400) {
        throw new Error(json.message)
      }

      setInscriptions(prevInscriptions => {
        const flatInscriptions = json.results.map((result: OrdinalUtxoResponse["results"][0]) => result.inscriptions).flat()
        if (!prevInscriptions || !nextPage) {
          return flatInscriptions;
        } else {
          return [...prevInscriptions, ...
            flatInscriptions];
        }
      });


      if ((json.offset + json.limit) < json.total) {
        setShowLoadMore(true)
      } else {
        setShowLoadMore(false)
      }

      if (nextPage) {
        setPage(page + 1);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    fetchOrdinalUtxo(address, page + 1);
  };

  const handleLookUp = () => {
    navigate(`/${address}`);
    // fetchOrdinalUtxo(address);
  }

  return (
    <div>
      <NavigationBar title="Ordinals Inscription Lookup" />
      <SectionContainer>
        <label htmlFor="address">Owner Bitcoin Address:</label>
        <TextField onKeyDown={handleLookUp} value={address} onChange={(e) => setAddress(e.target.value)} type="text" id="address" />
        <LookUpButton disabled={!address || address.trim() === "" || loading} onClick={handleLookUp} >Look up</LookUpButton>
      </SectionContainer>
      {error && <ErrorMessage data-testid="error-message">{error}</ErrorMessage>}
      {loading && <Loader />}
      {inscriptions && <InscriptionsList walletAddress={address} showLoadMore={showLoadMore} inscriptions={inscriptions} handleLoadMore={handleLoadMore} navigate={navigate} />}
    </div>
  );
}

