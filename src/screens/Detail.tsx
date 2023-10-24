import NavigationBar from "../components/NavigationBar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { InscriptionDetail, InscriptionDetailI } from "../components/InscriptionDetail";
import { Loader } from "../components/Loader";

export default function Detail() {
    const { address, id } = useParams();
    const [response, setResponse] = useState<InscriptionDetailI>();

    useEffect(() => {
        async function fetchData() {
            const response = await fetch(`https://api-3.xverse.app/v1/address/${address}/ordinals/inscriptions/${id}`);
            const json = await response.json();
            setResponse(json);
        }
        fetchData();
        // changing address or id via the url will need a full page reload, so we don't need to add them to the dependency array
    }, []);

    console.log(response)

    return (
        <div>
            <NavigationBar showBackButton title="Details" />
            {response ? <InscriptionDetail data={response} /> : <Loader />}
        </div>
    );
}