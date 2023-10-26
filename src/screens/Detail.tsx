import NavigationBar from "../components/NavigationBar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { InscriptionDetail, InscriptionDetailI } from "../components/InscriptionDetail";
import { Loader } from "../components/Loader";
import ErrorMessage from '../components/ErrorMessage';

export default function Detail() {
    const { address, id } = useParams();
    const [data, setData] = useState<InscriptionDetailI>();
    const [error, setError] = useState<string>("");

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`https://api-3.xverse.app/v1/address/${address}/ordinals/inscriptions/${id}`);

                const json = await response.json();

                if (json.status === 400) {
                    throw new Error(json.message)
                }
                setData(json);
            } catch (error: any) {
                setError(error.message)
            }
        }
        fetchData();
        // changing address or id via the url will need a full page reload, so we don't need to add them to the dependency array
    }, []);

    return (
        <div>
            <NavigationBar showBackButton title="Details" />
            {data && !error ? <InscriptionDetail data={data} /> : <Loader />}
            {error && <ErrorMessage data-testid="error-message">{error}</ErrorMessage>}
        </div>
    );
}